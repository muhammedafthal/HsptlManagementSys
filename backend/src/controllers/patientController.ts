import { Response } from "express";
import Patient from "../models/Patient";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin / Doctor)
export const getPatients = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const patients = await Patient.find().populate(
      "user",
      "name email phoneNumber role",
    );
    res
      .status(200)
      .json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single patient details
// @route   GET /api/patients/:id
// @access  Private (Admin / Doctor / Patient self)
export const getPatient = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "user",
      "name email phoneNumber role",
    );
    if (!patient) {
      res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
      return;
    }

    // Authorization: Admin, Doctor, or Patient self
    const isAdminOrDoctor =
      req.user.role === "admin" || req.user.role === "doctor";
    const isSelf = patient.user.toString() === req.user._id.toString();

    if (!isAdminOrDoctor && !isSelf) {
      res.status(403).json({
        success: false,
        message: "Not authorized to view this profile",
      });
      return;
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Patient self / Admin)
export const updatePatient = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
      return;
    }

    // Authorization: Admin or Patient self
    const isAdmin = req.user.role === "admin";
    const isSelf = patient.user.toString() === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
      return;
    }

    const { name, email, phoneNumber, address } = req.body;

    // Update User details if sent
    if (name || email || phoneNumber) {
      const user = await User.findById(patient.user);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        await user.save();
      }
    }

    // Update Patient details
    // if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    // if (gender) patient.gender = gender;
    // if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (address) patient.address = address;

    const updatedPatient = await patient.save();
    const populated = await Patient.findById(updatedPatient._id).populate(
      "user",
      "name email phoneNumber role",
    );

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deletePatient = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
      return;
    }

    // Delete associated Patient
    await Patient.findByIdAndDelete(patient.user);
    // Delete patient
    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient and associated user account deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

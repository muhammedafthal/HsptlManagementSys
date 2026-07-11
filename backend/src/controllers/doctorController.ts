import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctors = await Doctor.find().populate(
      "user",
      "name email phoneNumber role",
    );
    res
      .status(200)
      .json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phoneNumber role",
    );
    if (!doctor) {
      res.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Create doctor profile (User + Doctor details)
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      specialization,
      department,
      qualification,
      experience,
      availability,
      consultationFee,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
      return;
    }

    // Create user with doctor role
    const user = await User.create({
      name,
      email,
      password,
      role: "doctor",
      phoneNumber,
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      department,
      qualification,
      experience,
      availability: availability || [],
      consultationFee,
    });

    res.status(201).json({
      success: true,
      data: {
        id: doctor._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
        specialization: doctor.specialization,
        department: doctor.department,
        qualification: doctor.qualification,
        experience: doctor.experience,
        availability: doctor.availability,
        consultationFee: doctor.consultationFee,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin or Doctor self
export const updateDoctor = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
      return;
    }

    // Authorization: Admin or Doctor self
    const isAdmin = req.user.role === "admin";
    const isSelf = doctor.user.toString() === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
      return;
    }

    const {
      name,
      email,
      phoneNumber,
      specialization,
      department,
      qualification,
      experience,
      availability,
      consultationFee,
    } = req.body;

    // Update User details if sent
    if (name || email || phoneNumber) {
      const user = await User.findById(doctor.user);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        await user.save();
      }
    }

    // Update Doctor details
    if (specialization) doctor.specialization = specialization;
    if (department) doctor.department = department;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (availability) doctor.availability = availability;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;

    const updatedDoctor = await doctor.save();
    const populated = await Doctor.findById(updatedDoctor._id).populate(
      "user",
      "name email phoneNumber role",
    );

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
      return;
    }

    // Delete associated User
    await User.findByIdAndDelete(doctor.user);
    // Delete doctor
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor and associated user account deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

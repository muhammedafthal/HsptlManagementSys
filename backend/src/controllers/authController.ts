import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";
import { AuthRequest } from "../middleware/auth";

const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "supersecretkeyforhospitalmanagement123",
    {
      expiresIn: "30d",
    },
  );
};

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
export const registerPatient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      // email,
      // password,
      phoneNumber,
      // dateOfBirth,
      // gender,
      // bloodGroup,
      address,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      // email,
      // password,
      role: "patient",
      phoneNumber,
    });

    // Create patient profile
    const patient = await Patient.create({
      user: user._id,
      // dateOfBirth,
      // gender,
      // bloodGroup,
      address,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        // email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        patientProfileId: patient._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      res.status(400).json({
        success: false,
        message: "Please provide name and phone number",
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ name, phoneNumber }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (user.phoneNumber !== phoneNumber) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    // const isMatch = await (user as any).matchPassword(phoneNumber);
    // if (!isMatch) {
    //   res.status(401).json({ success: false, message: "Invalid credentials" });
    //   return;
    // }

    // Fetch related profile if patient or doctor
    let profileInfo: any = {};
    if (user.role === "patient") {
      const patient = await Patient.findOne({ user: user._id });
      if (patient)
        profileInfo = {
          patientProfileId: patient._id,
          patientDetails: patient,
        };
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor)
        profileInfo = { doctorProfileId: doctor._id, doctorDetails: doctor };
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        // email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        ...profileInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let profileInfo: any = {};
    if (user.role === "patient") {
      const patient = await Patient.findOne({ user: user._id });
      if (patient)
        profileInfo = {
          patientProfileId: patient._id,
          patientDetails: patient,
        };
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor)
        profileInfo = { doctorProfileId: doctor._id, doctorDetails: doctor };
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        ...profileInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

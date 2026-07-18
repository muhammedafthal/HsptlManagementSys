import { Response } from "express";
import Appointment from "../models/Appointment";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";
import { AuthRequest } from "../middleware/auth";
import TokenCounter from "../models/TokenCounter";

// Consistent "YYYY-MM-DD" key used by both Appointment.tokenDate and TokenCounter.date
const toDateKey = (d: Date | string): string => {
  return new Date(d).toISOString().split("T")[0];
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient / Admin)
export const bookAppointment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { doctorId, date, timeSlot, reason, patientId } = req.body;

    let targetPatientId = patientId;

    // If patient is booking, resolve their patient profile ID
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        res.status(404).json({
          success: false,
          message: "Patient profile not found for this user",
        });
        return;
      }
      targetPatientId = patient._id;
    }

    if (!targetPatientId) {
      res
        .status(400)
        .json({ success: false, message: "Patient ID is required" });
      return;
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: targetPatientId,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
      status: "pending",
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get all appointments (Admin) or filtered by role (Doctor/Patient)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    let query: any = {};

    // Filter based on role
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        res.status(200).json({ success: true, count: 0, data: [] });
        return;
      }
      query.patient = patient._id;
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        res.status(200).json({ success: true, count: 0, data: [] });
        return;
      }
      query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "name email phoneNumber" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phoneNumber" },
      })
      .sort({ date: 1, timeSlot: 1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patient",
        populate: { path: "user", select: "name email phoneNumber" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phoneNumber" },
      });

    if (!appointment) {
      res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
      return;
    }

    // Check authorization: Admin, appointment doctor, or appointment patient
    const isAdmin = req.user.role === "admin";
    const isDoctor =
      req.user.role === "doctor" &&
      (appointment.doctor as any).user.toString() === req.user._id.toString();
    const isPatient =
      req.user.role === "patient" &&
      (appointment.patient as any).user.toString() === req.user._id.toString();

    if (!isAdmin && !isDoctor && !isPatient) {
      res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
      return;
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin / Doctor)
export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { status, notes } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status" });
      return;
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
      return;
    }

    // Authorization: Admin or the assigned Doctor
    const doctor = await Doctor.findById(appointment.doctor);
    const isAssignedDoctor =
      doctor && doctor.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isAssignedDoctor) {
      res.status(403).json({
        success: false,
        message: "Not authorized to change status of this appointment",
      });
      return;
    }

    appointment.status = status;
    if (notes !== undefined) {
      appointment.notes = notes;
    }
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const generateToken = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patient",
        populate: { path: "user", select: "name phoneNumber" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name" },
      });

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    // Authorization: admin only
    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        message: "Only admin can generate token",
      });
      return;
    }

    const todayKey = toDateKey(new Date());
    const apptDateKey = toDateKey(appointment.date);

    // --- Expiry handling ---
    if (apptDateKey < todayKey) {
      // Appointment date already passed
      if (appointment.status === "pending") {
        appointment.status = "cancelled";
        await appointment.save();
      }
      res.status(400).json({
        success: false,
        message:
          appointment.status === "cancelled"
            ? "This appointment date has expired and has been cancelled"
            : "This appointment date has already expired",
      });
      return;
    }

    if (apptDateKey > todayKey) {
      res.status(400).json({
        success: false,
        message: "Cannot generate token for a future appointment",
      });
      return;
    }

    // --- Status check: only confirmed, same-day appointments qualify ---
    if (appointment.status !== "confirmed") {
      res.status(400).json({
        success: false,
        message: `Cannot generate token were the appointment is not confirmed!`,
      });
      return;
    }

    // --- Idempotency: if a token already exists for TODAY, just return it ---
    if (appointment.tokenNumber && appointment.tokenDate === todayKey) {
      res.status(200).json({
        success: true,
        message: "Token already generated for today",
        data: appointment,
      });
      return;
    }

    // --- Atomic, race-safe increment: next token for this doctor, today ---
    const counter = await TokenCounter.findOneAndUpdate(
      { doctor: appointment.doctor, date: todayKey },
      { $inc: { lastToken: 1 } },
      { new: true, upsert: true },
    );

    // --- Save the token onto the appointment ---
    appointment.tokenNumber = counter.lastToken;
    appointment.tokenDate = todayKey;
    appointment.tokenGeneratedAt = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Token generated successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Edit appointment date / time slot / reason
// @route   PUT /api/appointments/:id/edit
// @access  Private (Patient who booked it, or Admin)
export const editAppointment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { date, timeSlot, reason } = req.body;

    if (!date || !timeSlot || !reason) {
      res.status(400).json({
        success: false,
        message: "Please provide date, time slot and reason",
      });
      return;
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
      return;
    }

    // Only pending/confirmed appointments can be rescheduled
    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot edit an appointment that is already ${appointment.status}`,
      });
      return;
    }

    // Authorization: Admin, or the patient who booked it
    const isAdmin = req.user.role === "admin";

    const patient = await Patient.findById(appointment.patient);
    const isOwner =
      patient && patient.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message: "Not authorized to edit this appointment",
      });
      return;
    }

    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.reason = reason;

    // If the visit was already confirmed, rescheduling should send it back
    // for the doctor/admin to re-confirm the new date/slot.
    if (appointment.status === "confirmed") {
      appointment.status = "pending";
    }

    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient / Doctor / Admin)
export const cancelAppointment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
      return;
    }

    // Authorization: Admin or Doctor or Patient who booked
    const isAdmin = req.user.role === "admin";

    const doctor = await Doctor.findById(appointment.doctor);
    const isDoctor =
      doctor && doctor.user.toString() === req.user._id.toString();

    const patient = await Patient.findById(appointment.patient);
    const isPatient =
      patient && patient.user.toString() === req.user._id.toString();

    if (!isAdmin && !isDoctor && !isPatient) {
      res.status(403).json({
        success: false,
        message: "Not authorized to cancel this appointment",
      });
      return;
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

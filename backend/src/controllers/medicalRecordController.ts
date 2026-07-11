import { Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import Appointment from '../models/Appointment';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';
import { AuthRequest } from '../middleware/auth';

// @desc    Create medical record / add prescription
// @route   POST /api/records
// @access  Private (Doctor only)
export const createMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, patientId, symptoms, diagnosis, prescription } = req.body;

    // Verify doctor details
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      res.status(404).json({ success: false, message: 'Doctor profile not found for this user' });
      return;
    }

    // Verify patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    // Create record
    const record = await MedicalRecord.create({
      appointment: appointmentId || null,
      patient: patientId,
      doctor: doctor._id,
      symptoms,
      diagnosis,
      prescription: prescription || [],
    });

    // If appointment ID was provided, mark appointment as completed
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        appointment.status = 'completed';
        await appointment.save();
      }
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get medical records (filtered by user role)
// @route   GET /api/records
// @access  Private
export const getMedicalRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        res.status(200).json({ success: true, count: 0, data: [] });
        return;
      }
      query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        res.status(200).json({ success: true, count: 0, data: [] });
        return;
      }
      query.doctor = doctor._id;
    }

    // If patientId is specified in query parameters, let doctor or admin filter by it
    if (req.query.patientId && (req.user.role === 'doctor' || req.user.role === 'admin')) {
      query.patient = req.query.patientId;
    }

    const records = await MedicalRecord.find(query)
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phoneNumber' },
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phoneNumber specialization department' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single medical record details
// @route   GET /api/records/:id
// @access  Private
export const getMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phoneNumber' },
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phoneNumber specialization department' },
      });

    if (!record) {
      res.status(404).json({ success: false, message: 'Medical record not found' });
      return;
    }

    // Check authorization: Admin, record doctor, or record patient
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor' && (record.doctor as any).user.toString() === req.user._id.toString();
    const isPatient = req.user.role === 'patient' && (record.patient as any).user.toString() === req.user._id.toString();

    if (!isAdmin && !isDoctor && !isPatient) {
      res.status(403).json({ success: false, message: 'Not authorized to view this record' });
      return;
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

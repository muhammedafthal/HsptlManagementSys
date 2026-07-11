import { Response } from 'express';
import Bill from '../models/Bill';
import Patient from '../models/Patient';
import { AuthRequest } from '../middleware/auth';

// @desc    Generate a bill/invoice
// @route   POST /api/bills
// @access  Private (Admin only)
export const createBill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId, appointmentId, items, dueDate } = req.body;

    // Verify patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Bill items are required' });
      return;
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

    const bill = await Bill.create({
      patient: patientId,
      appointment: appointmentId || null,
      items,
      totalAmount,
      paymentStatus: 'unpaid',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    });

    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get bills (Admin: all bills, Patient: own bills)
// @route   GET /api/bills
// @access  Private
export const getBills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        res.status(200).json({ success: true, count: 0, data: [] });
        return;
      }
      query.patient = patient._id;
    }

    // Admin can filter by patientId in query parameters
    if (req.query.patientId && req.user.role === 'admin') {
      query.patient = req.query.patientId;
    }

    const bills = await Bill.find(query)
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phoneNumber' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get single bill detail
// @route   GET /api/bills/:id
// @access  Private
export const getBill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bill = await Bill.findById(req.params.id).populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phoneNumber' },
    });

    if (!bill) {
      res.status(404).json({ success: false, message: 'Bill not found' });
      return;
    }

    // Check authorization: Admin or the patient who owns the bill
    const isAdmin = req.user.role === 'admin';
    const isPatient = req.user.role === 'patient' && (bill.patient as any).user.toString() === req.user._id.toString();

    if (!isAdmin && !isPatient) {
      res.status(403).json({ success: false, message: 'Not authorized to view this bill' });
      return;
    }

    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update bill payment status
// @route   PUT /api/bills/:id/status
// @access  Private (Admin only)
export const updateBillStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    if (!['paid', 'unpaid'].includes(paymentStatus)) {
      res.status(400).json({ success: false, message: 'Invalid payment status' });
      return;
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      res.status(404).json({ success: false, message: 'Bill not found' });
      return;
    }

    bill.paymentStatus = paymentStatus;
    await bill.save();

    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

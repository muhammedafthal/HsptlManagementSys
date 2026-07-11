import { Router } from 'express';
import { createMedicalRecord, getMedicalRecords, getMedicalRecord } from '../controllers/medicalRecordController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect); // All medical records routes require authentication

router.route('/')
  .post(authorize('doctor'), createMedicalRecord)
  .get(getMedicalRecords);

router.route('/:id')
  .get(getMedicalRecord);

export default router;

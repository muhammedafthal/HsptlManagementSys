import { Router } from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, updateDoctor) // Authorization check inside controller (self or admin)
  .delete(protect, authorize('admin'), deleteDoctor);

export default router;

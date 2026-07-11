import { Router } from 'express';
import { createBill, getBills, getBill, updateBillStatus } from '../controllers/billController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect); // All billing routes require authentication

router.route('/')
  .post(authorize('admin'), createBill)
  .get(getBills);

router.route('/:id')
  .get(getBill);

router.route('/:id/status')
  .put(authorize('admin'), updateBillStatus);

export default router;

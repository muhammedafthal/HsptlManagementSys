import { Router } from "express";
import {
  bookAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  editAppointment,
  cancelAppointment,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.use(protect); // All appointment routes require authentication

router
  .route("/")
  .post(authorize("patient", "admin"), bookAppointment)
  .get(getAppointments);

router.route("/:id").get(getAppointment);

router
  .route("/:id/status")
  .put(authorize("admin", "doctor"), updateAppointmentStatus);

router.route("/:id/edit").put(editAppointment);

router.route("/:id/cancel").put(cancelAppointment);

export default router;

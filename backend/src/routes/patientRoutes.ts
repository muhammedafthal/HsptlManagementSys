import { Router } from "express";
import {
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.route("/").get(protect, authorize("admin", "doctor"), getPatients);

router
  .route("/:id")
  .get(protect, getPatient) // Auth checking inside controller
  .put(protect, updatePatient) // Auth checking inside controller
  .delete(protect, deletePatient); // Auth checking inside controller
export default router;

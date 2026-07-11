import { Router } from "express";
import { registerPatient, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", registerPatient);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;

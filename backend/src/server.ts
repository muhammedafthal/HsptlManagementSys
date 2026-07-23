import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import User from "./models/User";

// Import Routes
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import patientRoutes from "./routes/patientRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import medicalRecordRoutes from "./routes/medicalRecordRoutes";
import billRoutes from "./routes/billRoutes";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "*", // Allows connections from frontend dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/bills", billRoutes);

// Test endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Hospital Management System API is running...");
});

// Seed default Admin user if none exists
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("Seeding default Admin user...");
      await User.create({
        name: "System Admin",
        // email: "admin@hospital.com",
        // password: "admin123",
        role: "admin",
        phoneNumber: "0000000000",
      });
      console.log("Default Admin user created successfully:");
      console.log("Email: admin@hospital.com");
      console.log("Password: admin123");
    }
  } catch (error) {
    console.error("Error seeding admin user:", (error as Error).message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running in development mode on port ${PORT}`);
  await seedAdmin();
});

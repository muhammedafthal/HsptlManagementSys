import { Schema, model } from "mongoose";

const availabilitySchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  slots: {
    type: [String], // e.g. ["09:00 - 10:00", "10:00 - 11:00"]
    required: true,
  },
});

const doctorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: [true, "Please add a specialization"],
    },
    department: {
      type: String,
      required: [true, "Please add a department"],
      enum: [
        "Cardiology",
        "Neurology",
        "Critical care",
        "Pediatrics",
        "General Medicine",
        "Orthopedics",
        "Dermatology",
      ],
    },
    qualification: {
      type: String,
      required: [true, "Please add qualifications"],
    },
    experience: {
      type: Number,
      required: [true, "Please add experience in years"],
    },
    availability: [availabilitySchema],
    consultationFee: {
      type: Number,
      required: [true, "Please add consultation fee"],
      default: 500,
    },
  },
  {
    timestamps: true,
  },
);

export const Doctor = model("Doctor", doctorSchema);
export default Doctor;

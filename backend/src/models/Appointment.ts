// import { Schema, model } from "mongoose";

// const appointmentSchema = new Schema(
//   {
//     patient: {
//       type: Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true,
//     },
//     doctor: {
//       type: Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: [true, "Please add appointment date"],
//     },
//     timeSlot: {
//       type: String,
//       required: [true, "Please add time slot"],
//     },
//     reason: {
//       type: String,
//       required: [true, "Please add a reason for the appointment"],
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled", "completed"],
//       default: "pending",
//     },
//     notes: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Appointment = model("Appointment", appointmentSchema);
// export default Appointment;

import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please add appointment date"],
    },
    timeSlot: {
      type: String,
      required: [true, "Please add time slot"],
    },
    reason: {
      type: String,
      required: [true, "Please add a reason for the appointment"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    tokenNumber: {
      type: Number,
      default: null,
    },
    tokenDate: {
      type: String, // same "YYYY-MM-DD" format as TokenCounter.date
      default: null,
    },
    tokenGeneratedAt: {
      type: String, // display-friendly time, e.g. "10:42 AM"
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Appointment = model("Appointment", appointmentSchema);
export default Appointment;

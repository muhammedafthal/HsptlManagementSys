import { Schema, model } from "mongoose";

const patientSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // dateOfBirth: {
    //   type: Date,
    //   required: [true, "Please add date of birth"],
    // },
    // gender: {
    //   type: String,
    //   required: [true, "Please add gender"],
    //   enum: ["male", "female", "other"],
    // },
    // bloodGroup: {
    //   type: String,
    //   required: [true, "Please add blood group"],
    // },
    address: {
      type: String,
      required: [true, "Please add address"],
    },
  },
  {
    timestamps: true,
  },
);

export const Patient = model("Patient", patientSchema);
export default Patient;

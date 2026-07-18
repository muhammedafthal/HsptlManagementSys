import { Schema, model } from "mongoose";

const tokenCounterSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: String, // date-only key, e.g. "2026-07-17" — keeps lookups exact
      required: true,
    },
    lastToken: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// One counter per doctor per day — prevents duplicate counter docs
tokenCounterSchema.index({ doctor: 1, date: 1 }, { unique: true });

export const TokenCounter = model("TokenCounter", tokenCounterSchema);
export default TokenCounter;

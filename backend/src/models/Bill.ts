import { Schema, model } from 'mongoose';

const billItemSchema = new Schema({
  description: {
    type: String,
    required: true, // e.g. "Consultation Fee", "Lab Test", "Medicine"
  },
  amount: {
    type: Number,
    required: true,
  },
});

const billSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    items: [billItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = model('Bill', billSchema);
export default Bill;

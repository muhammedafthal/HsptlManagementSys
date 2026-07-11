import { Schema, model } from 'mongoose';

const prescriptionItemSchema = new Schema({
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // e.g. "500mg" or "1 tablet"
    required: true,
  },
  frequency: {
    type: String, // e.g. "Twice a day", "Once daily after food"
    required: true,
  },
  duration: {
    type: String, // e.g. "5 days", "1 month"
    required: true,
  },
});

const medicalRecordSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    symptoms: {
      type: String,
      required: [true, 'Please add patient symptoms'],
    },
    diagnosis: {
      type: String,
      required: [true, 'Please add a diagnosis'],
    },
    prescription: [prescriptionItemSchema],
  },
  {
    timestamps: true,
  }
);

export const MedicalRecord = model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;

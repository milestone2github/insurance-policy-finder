import { model, Schema } from "mongoose";

const MedicalHistorySchema = new Schema({
	memberId: { type: String, required: true, unique: true },
  medicalPage: { type: String, enum: ['medical-history', 'medical-test', 'hospitalisation'] },
  medicalIllness: [{ type: String }],
  otherIllness: { type: String, default: '' },
  hospitalisationYear: { type: String, default: '' }
});

export const MedicalHistory = model("medical", MedicalHistorySchema);
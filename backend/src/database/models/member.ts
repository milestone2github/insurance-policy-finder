import { model, Schema } from "mongoose";

const MemberSchema = new Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  pincode: { type: Number }
});

export const Member = model("member", MemberSchema);
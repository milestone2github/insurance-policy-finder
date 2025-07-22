import { model, Schema } from "mongoose";

const ExistingPolicySchema = new Schema({
	memberId: { type: String, required: true, unique: true },
  policyCount: { type: Number, required: true },
  policyName: { type: String, required: true, unique: true },
  policyRenewalDate: { type: String, required: true },
  coverAmount: { type: String, required: true },
  coverage: [{ type: Schema.Types.ObjectId, ref: 'member' }]
});

const ExistingPolicy = model("existingPolicy", ExistingPolicySchema);

module.exports = ExistingPolicy;

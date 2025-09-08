const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
  label: String,
  selected: Boolean,
  count: Number,
  countable: Boolean,
}, { _id: false });

const personalInfoSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  gender: String,
  pincode: String,
}, { _id: false });

const lifestyleSchema = new mongoose.Schema({
  lifestyleData: { type: Map, of: String }, // eg. { myself: "Fit", father: "Overweight" }
  alcoholHistory: {
    hasHistory: Boolean,
    alcoholHistoryData: { type: Map, of: String },
  },
  tobaccoHistory: {
    hasHistory: Boolean,
    tobaccoHistoryData: { type: Map, of: String },
  },
}, { _id: false });

const medicalConditionSchema = new mongoose.Schema({
  activeQuestion: String,
  selectedProfiles: [String],
  medicalData: {
    type: Map,
    of: new mongoose.Schema({
      selectedIllnesses: [String],
      otherIllness: String,
    }, { _id: false }),
  },
}, { _id: false });

const existingPolicySchema = new mongoose.Schema({
  hasExistingPolicy: Boolean,
  policyCount: Number,
  existingPolicyData: {
    type: Map,
    of: new mongoose.Schema({
      policyName: String,
      coverAmount: String,
      otherName: String,
      renewalDate: Date,
      policyType: String,
      coverage: mongoose.Schema.Types.Mixed, // can be Array or String
    }, { _id: false }),
  },
}, { _id: false });

const insuranceFormSchema = new mongoose.Schema(
	{
		contactNumber: { type: String, required: true, unique: true },
    isOpened: { type: Boolean, default: false },
		currentStep: { type: Number, default: 1 },
		progress: { type: Number, default: 0 },
    thankyouMessageSent: { type: Boolean, default: false },
		profiles: { profileData: { type: Map, of: profileSchema } },
		personal: { personalInfo: { type: Map, of: personalInfoSchema } },
		lifestyle: lifestyleSchema,
		medicalCondition: medicalConditionSchema,
		existingPolicy: existingPolicySchema,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("InsuranceForm", insuranceFormSchema);
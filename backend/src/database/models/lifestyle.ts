import { model, Schema } from "mongoose";

const LifestyleSchema = new Schema({
	memberId: { type: String, required: true, unique: true },
	fitness: {
		type: String,
		enum: ["fit", "underweight", "overweight", "obese"],
	},
	alcoholHistory: {
		consumption: { type: Boolean, default: "false" },
		frequency: {
			type: String,
			enum: ["Daily", "Weekly", "Occasionally", "Rarely"],
		},
	},
	tobaccoHistory: {
		consumption: { type: Boolean, default: "false" },
		usage: {
			type: String,
			enum: ["Under 5 units", "6 to 10 units", "Over 10 units"],
		},
	},
});

export const Lifestyle = model("lifestyle", LifestyleSchema);
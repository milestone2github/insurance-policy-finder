const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
	{
		phone: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		leadId: { type: String },
		file: { data: Buffer, contentType: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);

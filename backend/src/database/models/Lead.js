const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
	{
		id: { type: String, unique: true },			// crm generated id
		name: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		ownerId: { type: String },
		file: { data: Buffer, contentType: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);

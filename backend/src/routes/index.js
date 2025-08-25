const { Router } = require("express");
const { submitLeadToCRM } = require("../utils/submitLeadToCRM");
const multer = require("multer");
const otpRoutes = require("./otpRoutes");
const { default: InsuranceForm } = require("../database/models/InsuranceForm");

const router = Router();
const upload = multer();

// OTP routes
router.use("/otp", otpRoutes);

// Lead Submission API
router.post("/submit-lead", upload.single("file"), async (req, res) => {
	try {
		const output_lead_id = await submitLeadToCRM({
			phone: req.body.phone,
			name: req.body.name,
			lead_id: req.body?.lead_id,
			uploadedFile: req.file,
		});
		
		res.status(200).json({ success: true, lead_id: output_lead_id });
	} catch (err) {
		console.error("Submit lead error:", err);
		res.status(500).json({ error: err.message || "Internal Server Error" });
	}
});

// Data storage API
router.post("/insurance-form/:contactNumber", async (req, res) => {
	try {
		const { contactNumber } = req.params;
		const { currentStep, progress, ...storedData } = req.body;
		
    const updatedDoc = await InsuranceForm.findOneAndUpdate(
			{ contactNumber },
			{ $set: { ...storedData, contactNumber, currentStep, progress } },
			{ new: true, upsert: true }
		);

		res.json({ success: true, data: updatedDoc });
	} catch (err) {
		console.error("Couldn't update Insurance Form.");
		res.status(500).json({ message: "Internal Server Error." });
	}
})

// Fetch Insurance Form Data
router.get("/insurance-form/:contactNumber", async (req, res) => {
	try {
		const { contactNumber } = req.params;
		const form = await InsuranceForm.findOne({ contactNumber });
		if (!form) {
			return res.status(404).json({ success: false, message: "No form found" });
		}
		res.json({ success: true, data: form });
	} catch (err) {
		res.status(500).json({ success: false, error: "Server error" });
	}
});


module.exports = router;
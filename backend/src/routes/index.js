const { Router } = require("express");
const { submitLeadToCRM } = require("../utils/submitLeadToCRM");
const multer = require("multer");
const otpRoutes = require("./otpRoutes");

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

// If you want to enable additional routes later:
// const memberRoutes = require("./memberRoutes");
// const fitnessHistoryRoutes = require("./fitnessHistoryRoutes");
// const medicalHistoryRoutes = require("./medicalHistoryRoutes");
// const existingPolicyRoutes = require("./existingPolicyRoutes");

// router.use("/members", memberRoutes);
// router.use("/fitness", fitnessHistoryRoutes);
// router.use("/medical", medicalHistoryRoutes);
// router.use("/policy", existingPolicyRoutes);

module.exports = router;
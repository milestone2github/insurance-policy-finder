const { Router } = require("express");
const { submitLeadToCRM } = require("../utils/submitLeadToCRM");
const multer = require("multer");
const otpRoutes = require("./otpRoutes");
const InsuranceForm = require("../database/models/InsuranceForm");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyToken");

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
router.post("/insurance-form", verifyJWT, async (req, res) => {
	try {
		const contactNumber = req.contactNumber;
		const { currentStep, progress, isOpened, ...storedData } = req.body;

		// Fetch existing doc first
		const existingDoc = await InsuranceForm.findOne({ contactNumber });

		// Determine correct progress
		let finalProgress = progress;
		if (existingDoc && typeof existingDoc.progress === "number") {
			finalProgress = Math.max(existingDoc.progress, progress);
		}

		const updateObj = {
			...storedData,
			contactNumber,
			currentStep,
			progress: finalProgress,
		};

		if (typeof isOpened !== "undefined") {
			updateObj.isOpened = isOpened;
		}

		const updatedDoc = await InsuranceForm.findOneAndUpdate(
			{ contactNumber },
			{ $set: updateObj },
			{ new: true, upsert: true }
		);

		// res.json({ success: true, data: updatedDoc });  // Not sending the data back to FE
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// Generate JWT Token for leadless clean form submission
router.post("/generate-jwt", async (req, res) => {
	try {
		const contactNumber = req.body;
		if (!contactNumber) {
			res.status(400).json({ error: "Contact number not found in request." });
			return;
		}
		
		const token = jwt.sign({ contactNumber }, process.env.JWT_SECRET, {		// To-Do: SET SECRET in .env
			expiresIn: "10d",
		});
		res.status(200).json({ token });
	} catch (err) {
		console.error("Problem in generate-jwt API");
		res.status(500).json({ message: "Internal Server Error." });
	}
})


// Fetch Insurance Form Data
router.get("/insurance-form", verifyJWT, async (req, res) => {
	try {
		const { contactNumber } = req.contactNumber;
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
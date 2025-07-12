import { Request, Response, Router } from "express";
import { submitLeadToCRM } from "../utils/submitLeadToCRM";
// import memberRoutes from "./memberRoutes";
// import fitnessHistoryRoutes from "./fitnessHistoryRoutes";
// import medicalHistoryRoutes from "./medicalHistoryRoutes";
// import existingPolicyRoutes from "./existingPolicyRoutes";

const router = Router();
import multer from "multer";
const upload = multer();


// Lead Submission API
router.post("/submit-lead", upload.single("file"), async (req: Request, res: Response) => {
	try {
		const output_lead_id = await submitLeadToCRM({
			phone: req.body.phone,
			name: req.body.name,
			lead_id: req.body?.lead_id,
			uploadedFile: req.file,
		});
		res.status(200).json({ success: true, lead_id: output_lead_id });
	} catch (err: any) {
		console.error("Submit lead error:", err);
		res.status(500).json({ error: err.message || "Internal Server Error" });
	}
});

// router.use("/members", memberRoutes);
// router.use("/fitness", fitnessHistoryRoutes);
// router.use("/medical", medicalHistoryRoutes);
// router.use("/policy", existingPolicyRoutes);

export default router;

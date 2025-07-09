import { Request, Response, Router } from "express";
import { submitLeadToCRM } from "../utils/submitLeadToCRM";
// import memberRoutes from "./memberRoutes";
// import fitnessHistoryRoutes from "./fitnessHistoryRoutes";
// import medicalHistoryRoutes from "./medicalHistoryRoutes";
// import existingPolicyRoutes from "./existingPolicyRoutes";

const router = Router();

// Lead Submission API
router.post("/submit-lead", async (req: Request, res: Response) => {
	try {
		await submitLeadToCRM(req.body);
		res.status(200).json({ success: true });
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

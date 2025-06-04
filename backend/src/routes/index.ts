import { Router } from "express";
import memberRoutes from "./memberRoutes";
import fitnessHistoryRoutes from "./fitnessHistoryRoutes";
import medicalHistoryRoutes from "./medicalHistoryRoutes";
import existingPolicyRoutes from "./existingPolicyRoutes";

const router = Router();

router.use("/members", memberRoutes);
router.use("/fitness", fitnessHistoryRoutes);
router.use("/medical", medicalHistoryRoutes);
router.use("/existing-policy", existingPolicyRoutes);

export default router;

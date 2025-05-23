import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";

// import { useState } from "react";
// import MedicalReview, {
// 	type ProfileType,
// } from "./components/common/MadicalReview";
// import AdverseDetails from "./components/common/AdverseDetails";
// import ExistingInsurance from "./components/common/ExistingInsaurance";
// import ExistingPoliciesPage from "./components/common/ExistingPolicyPage";

// Reuse the same member‐shape you pass to AdverseDetails
// const ALL_MEMBERS: Record<
// 	ProfileType,
// 	{ type: ProfileType; label: string; age?: number; avatarUrl: string }
// > = {
// 	self: { type: "self", label: "You", avatarUrl: avatar },
// 	spouse: { type: "spouse", label: "Spouse", avatarUrl: avatar },
// 	father: { type: "father", label: "Dam Good", age: 55, avatarUrl: avatar },
// 	mother: { type: "mother", label: "Mother", avatarUrl: avatar },
// 	son: { type: "son", label: "Son", avatarUrl: avatar },
// 	daughter: { type: "daughter", label: "Daughter", avatarUrl: avatar },
// };

// // dropdown data for later steps
// const plans = [
// 	{ value: "plan-a", label: "Plan A" },
// 	{ value: "plan-b", label: "Plan B" },
// ];
// const members = [
// 	{ value: "self", label: "You" },
// 	{ value: "spouse", label: "Spouse" },
// 	{ value: "father", label: "Father" },
// ];

// /** Our “step” type: */
// type Step =
// 	| { kind: "medicalReview" }
// 	| { kind: "adverseDetails"; selected: ProfileType[] }
// 	| { kind: "existingInsurance" }
// 	| { kind: "existingPolicies"; planCount: number };

export default function App() {
	// 	const [step, setStep] = useState<Step>({ kind: "medicalReview" });

	// 	// sub‐state
	// 	const [adverseAnswers, setAdverseAnswers] = useState<
	// 		Record<ProfileType, any>
	// 	>({});
	// 	const [planCount, setPlanCount] = useState(0);

	// 	// When medicalReview “Next” fires:
	// 	function handleMedicalNext(selected: ProfileType[]) {
	// 		if (selected.length > 0) {
	// 			// user said “Yes” + picked members → go into adverseDetails
	// 			setStep({ kind: "adverseDetails", selected });
	// 		} else {
	// 			// user said “No” → skip to existingInsurance
	// 			setStep({ kind: "existingInsurance" });
	// 		}
	// 	}

	// 	// When adverseDetails “Next” fires:
	// 	function handleAdverseNext(answers: Record<ProfileType, any>) {
	// 		setAdverseAnswers(answers);
	// 		setStep({ kind: "existingInsurance" });
	// 	}

	// 	// When existingInsurance “Next” fires:
	// 	function handleExistingInsNext(count: number) {
	// 		setPlanCount(count);
	// 		if (count > 0) {
	// 			// show the policies‐detail page
	// 			setStep({ kind: "existingPolicies", planCount: count });
	// 		} else {
	// 			// skip straight to final review or submission
	// 			console.log("No existing plans. Submit everything now.");
	// 		}
	// 	}

	// 	// When existingPolicies “Review” fires:
	// 	function handlePoliciesReview(allData: any[]) {
	// 		console.log("All data:", {
	// 			adverse: adverseAnswers,
	// 			planCount,
	// 			policies: allData,
	// 		});
	// 		// final submit…
	// 	}

	return (
		<>
			<div className="flex h-screen">
				<Sidebar />
				<AppRoutes />
			</div>
			{/* {step.kind === "medicalReview" && (
				<MedicalReview
					onNext={handleMedicalNext}
					onPrev={() => console.log("Cancel / Go back")}
				/>
			)}

			{step.kind === "adverseDetails" && (
				<AdverseDetails
					members={step.selected.map((t) => ALL_MEMBERS[t])}
					onPrev={() => setStep({ kind: "medicalReview" })}
					onNext={handleAdverseNext}
				/>
			)}

			{step.kind === "existingInsurance" && (
				<ExistingInsurance
					onPrev={() =>
						// if we came from adverseDetails, go back there
						Object.hasOwn(step, "selected")
							? setStep({ kind: "adverseDetails", selected: step.selected! })
							: setStep({ kind: "medicalReview" })
					}
					onNext={handleExistingInsNext}
				/>
			)}

			{step.kind === "existingPolicies" && (
				<ExistingPoliciesPage
					planCount={step.planCount}
					policyOptions={plans}
					memberOptions={members}
					onPrev={() => setStep({ kind: "existingInsurance" })}
					onReview={handlePoliciesReview}
				/>
			)} */}
		</>
	);
}

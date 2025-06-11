import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import { cleanExistingPolicyData, setAllExistingPolicyData } from "../../store/ExistingPolicySlice";
import type {
	FloaterPolicyData,
	IndividualPolicyData,
	PolicyData,
	PolicyType,
	ProfileType,
} from "../../utils/interfaces";
import SmallButton from "../../components/shared/SmallButton";
import toast from "react-hot-toast";

const insurancePlans = [
	{ label: "HDFC Life" },
	{ label: "ICICI Health" },
	{ label: "Star MediCare" },
	{ label: "Niva Bupa" },
	{ label: "Tata AIG" },
];

const PolicyDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const existingPolicy = useSelector((s: RootState) => s.existingPolicy);
	const hasExistingPolicy = existingPolicy.hasExistingPolicy;

	const membersList = useMemo(() => {
		return Object.entries(personalInfo).map(([profileType, data]) => ({
			profileType: profileType as ProfileType,
			label: `${profileType} (${data.name})`,
		}));
	}, [personalInfo]);

	const [collapsedIndexes, setCollapsedIndexes] = useState<Set<number>>(
		new Set()
	);
	const [policyForm, setPolicyForm] = useState<PolicyData[]>([]);

	useEffect(() => {
		if (!hasExistingPolicy || (existingPolicy.policyCount ?? 0) < 1) {
			navigate("/policies");
			return;
		}

		const count = existingPolicy.policyCount ?? 0;
		const data = Object.values(existingPolicy.existingPolicyData ?? {});
		const toISODate = (date: string | Date) =>
			date instanceof Date ? date.toISOString() : new Date(date).toISOString();

		const finalPolicies: PolicyData[] = Array.from(
			{ length: count },
			(_, i) => {
				const policy = data[i];

				if (!policy) {
					return {
						policyType: "individual",
						policyName: "",
						coverAmount: "",
						otherName: "",
						renewalDate: new Date().toISOString(),
						coverage: "",
					};
				}

				const policyType = policy.policyType as PolicyType;
				const renewalDate = toISODate(policy.renewalDate);

				if (policyType === "floater") {
					return {
						...policy,
						policyType,
						renewalDate,
						coverage: Array.isArray(policy.coverage)
							? policy.coverage
							: [policy.coverage],
					} as FloaterPolicyData;
				}

				return {
					...policy,
					policyType,
					renewalDate,
					coverage:
						typeof policy.coverage === "string"
							? policy.coverage
							: policy.coverage?.[0] ?? "",
				} as IndividualPolicyData;
			}
		);

		setPolicyForm(finalPolicies);
	}, [existingPolicy, navigate, hasExistingPolicy]);

	const handleChange = (index: number, field: string, value: any) => {
		setPolicyForm((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				[field]: value,
			};
			return updated;
		});
	};

	const toggleCollapse = (index: number) => {
		setCollapsedIndexes((prev) => {
			const updated = new Set(prev);
			updated.has(index) ? updated.delete(index) : updated.add(index);
			return updated;
		});
	};

	const toggleFloaterMember = (index: number, member: ProfileType) => {
		setPolicyForm((prev) => {
			const updated = [...prev];
			const current = updated[index] as FloaterPolicyData;
			const coverage = new Set(current.coverage as ProfileType[]);
			if (coverage.has(member)) {
				coverage.delete(member);
			} else {
				coverage.add(member);
			}
			updated[index] = {
				...current,
				coverage: Array.from(coverage),
			};
			return updated;
		});
	};

	const handleNext = () => {
		for (let i = 0; i < policyForm.length; i++) {
			const policy = policyForm[i];
			if (
				!policy.policyName ||
				!policy.coverAmount ||
				!policy.renewalDate ||
				(policy.policyType === "individual" && !policy.coverage) ||
				(policy.policyType === "floater" &&
					(!Array.isArray(policy.coverage) || policy.coverage.length === 0))
			) {
				toast.error(`Please complete all fields for Policy ${i + 1}`);
				return;
			}
		}

		const formattedData = policyForm.reduce<{ [key: string]: PolicyData }>(
			(acc, policy, index) => {
				acc[`policy-${index + 1}`] = policy;
				return acc;
			},
			{}
		);
		
		dispatch(cleanExistingPolicyData());
		dispatch(setAllExistingPolicyData(formattedData));
		navigate("/review");
	};

	const handlePrev = () => {
		const formattedData = policyForm.reduce<{ [key: string]: PolicyData }>(
			(acc, policy, index) => {
				acc[`policy-${index + 1}`] = policy;
				return acc;
			},
			{}
		);
		dispatch(setAllExistingPolicyData(formattedData));
		navigate("/policies");
	};

	const todayISO = new Date().toISOString().split("T")[0];

	return (
		<div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
			{policyForm.map((policy, index) => {
				const collapsed = collapsedIndexes.has(index);
				const isIndividual = policy.policyType === "individual";

				return (
					<div
						key={index}
						className="bg-white rounded-xl shadow-md p-5 transition-all space-y-4"
					>
						<div className="flex justify-between items-center">
							<h2 className="font-semibold text-lg">Policy {index + 1}</h2>
							<button
								onClick={() => toggleCollapse(index)}
								className="text-gray-500 hover:text-gray-700 text-xl select-none"
							>
								{collapsed ? "▼" : "▲"}
							</button>
						</div>

						{!collapsed && (
							<div className="space-y-5">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block mb-1 font-medium">
											Insurance Plan:
										</label>
										<select
											className="w-full border rounded-md px-3 py-2 bg-white"
											value={policy.policyName}
											onChange={(e) =>
												handleChange(index, "policyName", e.target.value)
											}
										>
											<option value="">Select plan</option>
											{insurancePlans.map((plan) => (
												<option key={plan.label} value={plan.label}>
													{plan.label}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block mb-1 font-medium">
											Cover Amount (in Lacs):
										</label>
										<input
											// type="number"
											className="w-full border rounded-md px-3 py-2"
											value={policy.coverAmount}
											onChange={(e) =>
												handleChange(index, "coverAmount", e.target.value)
											}
											min={0}
										/>
									</div>

									<div>
										<label className="block mb-1 font-medium">
											Other Name:
										</label>
										<input
											className="w-full border rounded-md px-3 py-2"
											value={policy.otherName}
											onChange={(e) =>
												handleChange(index, "otherName", e.target.value)
											}
										/>
									</div>

									<div>
										<label className="block mb-1 font-medium">
											Renewal Date:
										</label>
										<input
											type="date"
											className="w-full border rounded-md px-3 py-2"
											min={todayISO}
											value={new Date(policy.renewalDate).toISOString().split("T")[0] || todayISO}
											onChange={(e) => {
												const value = e.target.value;
												if (value && value < todayISO) {
													toast.error("Renewal date cannot be in the past.");
													return;
												}
												handleChange(index, "renewalDate", value || todayISO);
											}}
											// value={policy.renewalDate || todayISO}
											// value={
											// 	new Date(policy.renewalDate).toISOString().split("T")[0]
											// }
											// handleChange(
											// 	index,
											// 	"renewalDate",
											// 	new Date(e.target.value)
											// )
										/>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div className="flex flex-col">
										<label className="block mb-1 font-medium">
											Policy Type:
										</label>
										<div className="flex gap-3 mt-1">
											<SmallButton
												color={isIndividual ? "deepblue" : "gray"}
												variant={isIndividual ? "solid" : "ghost"}
												onClick={() =>
													handleChange(index, "policyType", "individual")
												}
											>
												Individual
											</SmallButton>
											<SmallButton
												color={!isIndividual ? "darkblue" : "gray"}
												variant={!isIndividual ? "solid" : "ghost"}
												onClick={() =>
													handleChange(index, "policyType", "floater")
												}
											>
												Floater
											</SmallButton>
										</div>
									</div>

									{isIndividual && (
										<div className="flex-1 min-w-[160px] mt-4 sm:mt-0">
											<label className="block mb-1 font-medium">
												Members Covered:
											</label>
											<select
												className="w-full border rounded-md px-3 py-2"
												value={policy.coverage as string}
												onChange={(e) =>
													handleChange(index, "coverage", e.target.value)
												}
											>
												<option value="">Select member</option>
												{membersList.map((m) => (
													<option key={m.profileType} value={m.profileType}>
														{m.label}
													</option>
												))}
											</select>
										</div>
									)}
								</div>

								{!isIndividual && (
									<div className="flex flex-wrap gap-2 mt-3">
										{membersList.map((m) => {
											const selected =
												Array.isArray(policy.coverage) &&
												policy.coverage.includes(m.profileType);
											return (
												<SmallButton
													key={m.profileType}
													color={selected ? "deepblue" : "gray"}
													variant={selected ? "solid" : "ghost"}
													onClick={() =>
														toggleFloaterMember(index, m.profileType)
													}
												>
													{m.label}
												</SmallButton>
											);
										})}
									</div>
								)}
							</div>
						)}
					</div>
				);
			})}

			<div className="flex justify-center gap-6 pt-4">
				<SmallButton color="gray" variant="outline" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton color="darkblue" onClick={handleNext}>
					Next
				</SmallButton>
			</div>
		</div>
	);
};

export default PolicyDetails;
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cleanExistingPolicyData, setAllExistingPolicyData } from "../../store/ExistingPolicySlice";
import SmallButton from "../../components/shared/SmallButton";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { sendDataToDb } from "../../utils/upsertDb";
import { useProgressValue } from "../../utils/ProgressContext";

const insurancePlans = [
	{ label: "HDFC Life" },
	{ label: "ICICI Health" },
	{ label: "Star MediCare" },
	{ label: "Niva Bupa" },
	{ label: "Tata AIG" },
];

const PolicyDetails = () => {
	const progressPercent = useProgressValue();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const personalInfo = useSelector((s) => s.personal.personalInfo);
	const existingPolicy = useSelector((s) => s.existingPolicy);
	const hasExistingPolicy = existingPolicy.hasExistingPolicy;

	const membersList = useMemo(() => {
		return Object.entries(personalInfo).map(([profileType, data]) => ({
			profileType: profileType,
			label: `${profileType} (${data.name})`,
		}));
	}, [personalInfo]);

	const [collapsedIndexes, setCollapsedIndexes] = useState(new Set());
	const [policyForm, setPolicyForm] = useState([]);

	useEffect(() => {
		if (!hasExistingPolicy || (existingPolicy.policyCount ?? 0) < 1) {
			navigate("/policies");
			return;
		}

		const count = existingPolicy.policyCount ?? 0;
		const data = Object.values(existingPolicy.existingPolicyData ?? {});
		const toISODate = (date) =>
			date instanceof Date ? date.toISOString() : new Date(date).toISOString();

		const finalPolicies = Array.from(
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

				const policyType = policy.policyType;
				const renewalDate = toISODate(policy.renewalDate);

				if (policyType === "floater") {
					return {
						...policy,
						policyType,
						renewalDate,
						coverage: Array.isArray(policy.coverage)
							? policy.coverage
							: [policy.coverage],
					};
				}

				return {
					...policy,
					policyType,
					renewalDate,
					coverage:
						typeof policy.coverage === "string"
							? policy.coverage
							: policy.coverage?.[0] ?? "",
				};
			}
		);

		setPolicyForm(finalPolicies);
	}, [existingPolicy, navigate, hasExistingPolicy]);

	const handleChange = (index, field, value) => {
		setPolicyForm((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				[field]: value,
			};
			return updated;
		});
	};

	const toggleCollapse = (index) => {
		setCollapsedIndexes((prev) => {
			const updated = new Set(prev);
			updated.has(index) ? updated.delete(index) : updated.add(index);
			return updated;
		});
	};

	const toggleFloaterMember = (index, member) => {
		setPolicyForm((prev) => {
			const updated = [...prev];
			const current = updated[index];
			const coverage = new Set(current.coverage);
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

	const handleNext = async () => {
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

		const formattedData = policyForm.reduce((acc, policy, index) => {
			acc[`policy-${index + 1}`] = policy;
			return acc;
		}, {});

		dispatch(cleanExistingPolicyData());
		dispatch(setAllExistingPolicyData(formattedData));
		await sendDataToDb(5, progressPercent);
		navigate("/review");
	};

	const handlePrev = () => {
		const formattedData = policyForm.reduce(
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
		// <div className="max-w-3xl mx-auto py-8 px-4 h-[calc(100vh-50px)] flex flex-col">
		<div className="flex flex-col w-fit sm:w-3/4 2xl:w-1/2 mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Kindly provide the details of your current insurance policies.
			</h2>

			<div className="flex-1 overflow-auto space-y-6 pb-6 min-h-[250px]">
				{policyForm.map((policy, index) => {
					const collapsed = collapsedIndexes.has(index);
					const isIndividual = policy.policyType === "individual";

					return (
						<div
							key={index}
							className="rounded-md border border-gray-300 shadow-sm overflow-hidden"
						>
							<button
								onClick={() => toggleCollapse(index)}
								className="w-full flex justify-between items-center bg-[#2D3748] text-white px-4 py-3 text-base font-semibold"
							>
								<span>Policy {index + 1}</span>
								<span className="text-md">
									{collapsed ? <FaChevronDown /> : <FaChevronUp />}
								</span>
							</button>

							{!collapsed && (
								<div className="bg-white px-4 py-5 space-y-5">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block mb-1 font-medium">
												Name of Insurance Plan*
											</label>
											<select
												className="w-full border border-gray-300 rounded-md px-3 py-2"
												value={policy.policyName}
												onChange={(e) =>
													handleChange(index, "policyName", e.target.value)
												}
											>
												<option value="">Select Plan</option>
												{insurancePlans.map((plan) => (
													<option key={plan.label} value={plan.label}>
														{plan.label}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block mb-1 font-medium">
												Cover Amount *
											</label>
											<input
												type="text"
												inputMode="numeric"
												pattern="[0-9]*"
												className={`w-full border rounded-md px-3 py-2`}
												value={policy.coverAmount}
												onChange={(e) =>
													handleChange(
														index,
														"coverAmount",
														e.target.value.replace(/\D/g, "")
													)
												}
											/>
										</div>

										<div>
											<label className="block mb-1 font-medium">
												Other Plan Name
											</label>
											<input
												className="w-full border border-gray-300 rounded-md px-3 py-2"
												value={policy.otherName}
												onChange={(e) =>
													handleChange(index, "otherName", e.target.value)
												}
											/>
										</div>

										<div>
											<label className="block mb-1 font-medium">
												Policy Renewal Date*
											</label>
											<input
												type="date"
												className="w-full border border-gray-300 rounded-md px-3 py-2"
												min={todayISO}
												value={
													new Date(policy.renewalDate)
														.toISOString()
														.split("T")[0] || todayISO
												}
												onChange={(e) => {
													const value = e.target.value;
													if (value && value < todayISO) {
														toast.error("Renewal date cannot be in the past.");
														return;
													}
													handleChange(index, "renewalDate", value || todayISO);
												}}
											/>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
										<div className="flex flex-col">
											<label className="block mb-1 font-medium">
												Type of Policy*
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

										{isIndividual ? (
											<div className="flex-1 min-w-[160px]">
												<label className="block mb-1 font-medium">
													Members Covered*
												</label>
												<select
													className="w-full border border-gray-300 rounded-md px-3 py-2"
													value={policy.coverage}
													onChange={(e) =>
														handleChange(index, "coverage", e.target.value)
													}
												>
													<option value="">Select Member</option>
													{membersList.map((m) => (
														<option key={m.profileType} value={m.profileType}>
															{m.label}
														</option>
													))}
												</select>
											</div>
										) : (
											<div className="flex flex-wrap gap-2 mt-4">
												{membersList.map((m) => {
													const selected =
														Array.isArray(policy.coverage) &&
														policy.coverage.includes(m.profileType);

													const [label, name] = m.label.split(" (");
													const formattedName = name ? `(${name}` : "";

													return (
														<SmallButton
															key={m.profileType}
															color={selected ? "deepblue" : "gray"}
															variant={selected ? "solid" : "ghost"}
															onClick={() =>
																toggleFloaterMember(index, m.profileType)
															}
															className="text-sm px-3 py-1.5 min-w-[100px] text-center leading-tight"
														>
															<div className="flex flex-col">
																<span>{label.trim()}</span>
																<span className="text-xs text-white-600">
																	{formattedName}
																</span>
															</div>
														</SmallButton>
													);
												})}
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="border-t border-gray-200 pt-8 mt-8 bg-[#f9fafa]">
				<div className="flex justify-center gap-5">
					<SmallButton onClick={handlePrev} variant="ghost" color="gray">
						Previous
					</SmallButton>
					<SmallButton onClick={handleNext} color="darkblue">
						Review
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default PolicyDetails;
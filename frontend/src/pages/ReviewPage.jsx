import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exportReviewAsPDF } from "../utils/exportReviewAsPDF";
import SmallButton from "../components/shared/SmallButton";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { sendDataToDb } from "../utils/upsertDb";
import { useProgressValue } from "../utils/progressContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Review = () => {
	const progressPercent = useProgressValue();
	const navigate = useNavigate();
	const profiles = useSelector((s) => s.profiles);
	const personal = useSelector((s) => s.personal);
	const lifestyle = useSelector((s) => s.lifestyle);
	const medicalCondition = useSelector((s) => s.medicalCondition);
	const existingPolicy = useSelector((s) => s.existingPolicy);


	const profileData = profiles?.profileData || {};
	const selectedProfiles = Object.entries(profileData)
		.filter(([_, val]) => val.selected)
		.flatMap(([key, val]) =>
			val.countable
				? Array.from({ length: val.count }, (_, i) => `${key}-${i + 1}`)
				: [key]
		);

		// Generate Lead from the Backend
		useEffect(() => {
			const name = personal?.personalInfo?.myself?.name;
			const lead = JSON.parse(localStorage.getItem("leadDetails") || "{}");
			if (selectedProfiles.length > 0 && lead?.phone) {
				(async () => {
					try {
						const blob = exportReviewAsPDF(
							{
								profiles,
								personal,
								lifestyle,
								medicalCondition,
								existingPolicy,
							},
							{ returnBlob: true }
						);
						
						if (blob) {
							const formData = new FormData();
							formData.append("file", blob, "InsuranceLead.pdf");
							formData.append("phone", lead.phone);
							formData.append("name", name);
							formData.append("lead_id", lead?.lead_id || "");

							const url = baseUrl ? `${baseUrl}/api/submit-lead` : `/api/submit-lead`;

							await axios
								.post(url,
									formData,
									// { headers: { "Content-Type": "multipart/form-data" } }
								)
								.then((result) => {
									if (result.data.success === true) {
										const currentCount = Number(lead?.leadUploadCount || "0");
										localStorage.setItem(
											"leadDetails",
											JSON.stringify({
												...lead,
												lead_id: result.data.lead_id,				// Store lead_id to fetch existing details from CRM
												leadUploadCount: currentCount + 1,	// Store count how mny times new lead is uploaded
											})
										);
									}
								});
						}
					} catch (err) {
						console.error("PDF upload failed:", err);
					}
				})();
			}
		}, []);

	// Redirect to Home if no profiles selected
	useEffect(() => {
		if (selectedProfiles.length === 0) {
			navigate("/");
		}
	}, [selectedProfiles, navigate]);

	const getLabel = (key) => {
		const baseKey = key.split("-")[0];
		return (
			profileData[baseKey]?.label +
			(key.includes("-") ? ` ${key.split("-")[1]}` : "")
		);
	};
	
	const getName = (key) => personal?.personalInfo?.[key]?.name || key;
	
	const goTo = (path) => () => navigate(path);
	
	sendDataToDb(6, progressPercent);	// Send data in JSON to database

	const handlePrev = () => {
		navigate('/policies');
	}

	return (
		<div className="p-4 md:p-6 space-y-8 bg-gray-50">
			{/* Personal Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
					<h2 className="text-lg font-semibold text-[#203b6b]">
						1. Personal Details:
					</h2>
					<button
						className="flex items-center gap-1 text-[#0B1761] cursor-pointer"
						onClick={goTo("/")}
					>
						<span>Edit</span>
						<FaEdit className="text-sm" />
					</button>
				</div>
				<div className="mb-2">
					<span className="font-semibold">Members Covered:</span>{" "}
					<span className="font-bold italic">
						{selectedProfiles.map(getLabel).join(", ")}
					</span>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm shadow-xs mt-2">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-2">Name</th>
								<th className="p-2">Gender</th>
								<th className="p-2">DOB</th>
							</tr>
						</thead>
						<tbody>
							{selectedProfiles.map((key) => {
								const info = personal?.personalInfo?.[key] || {};
								return (
									<tr key={key}>
										<td className="p-2 text-center">{info.name}</td>
										<td className="p-2 text-center">{info.gender}</td>
										<td className="p-2 text-center">{info.dob}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			{/* Lifestyle Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
					<h2 className="text-lg font-semibold text-[#203b6b]">
						2. Lifestyle Details:
					</h2>
					<button
						className="flex items-center gap-1 text-[#0B1761] cursor-pointer"
						onClick={goTo("/lifestyle")}
					>
						<span>Edit</span>
						<FaEdit className="text-sm" />
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm shadow-xs">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-2">Name</th>
								<th className="p-2">Fitness</th>
								<th className="p-2">Consumes Alcohol</th>
								<th className="p-2">Consumes Tobacco</th>
							</tr>
						</thead>
						<tbody>
							{selectedProfiles.map((key) => (
								<tr key={key}>
									<td className="p-2 text-center">{getName(key)}</td>
									<td className="p-2 text-center">
										{lifestyle.lifestyleData?.[key] || "—"}
									</td>
									<td className="p-2 text-center">
										{lifestyle.alcoholHistory?.hasHistory &&
										lifestyle.alcoholHistory.alcoholHistoryData?.[key]
											? `Yes (${lifestyle.alcoholHistory.alcoholHistoryData[key]})`
											: "No"}
									</td>
									<td className="p-2 text-center">
										{lifestyle.tobaccoHistory?.hasHistory &&
										lifestyle.tobaccoHistory.tobaccoHistoryData?.[key]
											? `Yes (${lifestyle.tobaccoHistory.tobaccoHistoryData[key]})`
											: "No"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Medical Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
					<h2 className="text-lg font-semibold text-[#203b6b]">
						3. Medical/Health Details:
					</h2>
					<button
						className="flex items-center gap-1 text-[#0B1761] cursor-pointer"
						onClick={goTo("/medical-history")}
					>
						<span>Edit</span>
						<FaEdit className="text-sm" />
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm shadow-xs">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-2">Name</th>
								<th className="p-2">Medical History</th>
								<th className="p-2">Other Illness</th>
								<th className="p-2">Hospitalised</th>
							</tr>
						</thead>
						<tbody>
							{selectedProfiles.map((key) => {
								const med = medicalCondition.medicalData?.[key];
								const illnesses = med?.selectedIllnesses ?? [];
								const otherIllness = med?.otherIllness?.trim() || "";
								const hospitalisedYear = med?.hospitalisationYear?.trim();
								const hospitalised = !!hospitalisedYear;

								return (
									<tr key={key}>
										<td className="p-2 text-center">{getName(key)}</td>
										<td className="p-2">
											{illnesses.length > 0 ? illnesses.join(", ") : "No"}
										</td>
										<td className="p-2 text-center">{otherIllness || "No"}</td>
										<td className="p-2 text-center">
											{hospitalised ? `Yes (${hospitalisedYear})` : "No"}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			{/* Existing Policy Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
					<h2 className="text-lg font-semibold text-[#203b6b]">
						4. Existing Policy Details:
					</h2>
					<button
						className="flex items-center gap-1 text-[#0B1761] cursor-pointer"
						onClick={goTo("/policies")}
					>
						<span>Edit</span>
						<FaEdit className="text-sm" />
					</button>
				</div>
				<div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm">
					<div className="flex items-center">
						<span className="font-semibold pr-1">Status:</span>
						<span>{existingPolicy.hasExistingPolicy ? "Yes" : "No"}</span>
					</div>
					<div className="flex items-center">
						<span className="font-semibold pr-1">Count:</span>
						<span>
							{Object.keys(existingPolicy.existingPolicyData || {}).length}
						</span>
					</div>
					<div className="flex items-center">
						<span className="font-semibold pr-1">Type:</span>
						<span>Retail</span>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:flex-wrap gap-4">
					{Object.entries(existingPolicy.existingPolicyData || {}).map(
						([id, policy]) => (
							<div
								key={id}
								className="w-full md:w-[48%] border-transparent p-3 mb-3 text-sm bg-slate-100 rounded-md"
							>
								<p>
									<strong>ID:</strong> {id}
								</p>
								<p>
									<strong>Policy Name:</strong>{" "}
									<span className="font-semibold italic">
										{policy.policyName}
									</span>
								</p>
								<p>
									<strong>Plan Name:</strong>{" "}
									<span className="font-semibold italic">
										{policy.otherName}
									</span>
								</p>
								<p>
									<strong>Policy Renewal Date:</strong>{" "}
									{new Date(policy.renewalDate).toLocaleDateString()}
								</p>
								<p>
									<strong>Cover amount:</strong> {policy.coverAmount} lacs
								</p>
								<p>
									<strong>Members covered:</strong>
									<span className="italic ml-2">
										[
										{Array.isArray(policy.coverage)
											? policy.coverage.map(getLabel).join(", ")
											: getLabel(policy.coverage)}
										]
									</span>
								</p>
							</div>
						)
					)}
				</div>
			</section>

			<div className="flex flex-row justify-center gap-4 pt-4">
				<SmallButton color="gray" variant="outline" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton
					onClick={() =>
						exportReviewAsPDF({
							profiles,
							personal,
							lifestyle,
							medicalCondition,
							existingPolicy,
						})
					}
					color="deepblue"
					variant="solid"
				>
					Export as PDF
				</SmallButton>
			</div>
		</div>
	);	
};

export default Review;

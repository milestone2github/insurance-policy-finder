import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Review = () => {
	const navigate = useNavigate();
	const { profiles, personal, lifestyle, medicalCondition, existingPolicy } =
		useSelector((state: any) => state);

	const profileData = profiles?.profileData || {};
	const selectedProfiles = Object.entries(profileData)
		.filter(([_, val]: any) => val.selected)
		.flatMap(([key, val]: any) =>
			val.countable
				? Array.from({ length: val.count }, (_, i) => `${key}-${i + 1}`)
				: [key]
		);

	// Redirect if no profiles selected
	useEffect(() => {
		if (selectedProfiles.length === 0) {
			navigate("/");
		}
	}, [selectedProfiles, navigate]);

	const getLabel = (key: string) => {
		const baseKey = key.split("-")[0];
		return (
			profileData[baseKey]?.label +
			(key.includes("-") ? ` ${key.split("-")[1]}` : "")
		);
	};

	const getName = (key: string) => personal?.personalInfo?.[key]?.name || key;

	const goTo = (path: string) => () => navigate(path);

	return (
		<div className="p-6 space-y-8 bg-gray-50">
			{/* Personal Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-semibold text-indigo-700">
						1. Personal Details:
					</h2>
					<button className="text-blue-500" onClick={goTo("/")}>
						Edit
					</button>
				</div>
				<div className="mb-2">
					<span className="font-semibold">Members Covered:</span>{" "}
					<span className="font-bold italic">
						{selectedProfiles.map(getLabel).join(", ")}
					</span>
				</div>
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
			</section>

			{/* Lifestyle Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-semibold text-indigo-700">
						2. Lifestyle Details:
					</h2>
					<button className="text-blue-500" onClick={goTo("/lifestyle")}>
						Edit
					</button>
				</div>
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
			</section>

			{/* Medical Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-semibold text-indigo-700">
						3. Medical/Health Details:
					</h2>
					<button className="text-blue-500" onClick={goTo("/medical-history")}>
						Edit
					</button>
				</div>
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
			</section>

			{/* Existing Policy Details */}
			<section className="bg-white p-4 rounded shadow">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-semibold text-indigo-600">
						4. Existing Policy Details:
					</h2>
					<button className="text-blue-500" onClick={goTo("/policies")}>
						Edit
					</button>
				</div>
				<div className="mb-2">
					<table className="text-sm">
						<tbody>
							<tr>
								<td className="pr-2 font-semibold">Status:</td>
								<td>{existingPolicy.hasExistingPolicy ? "Yes" : "No"}</td>
							</tr>
							<tr>
								<td className="pr-2 font-semibold">Count:</td>
								<td>
									{Object.keys(existingPolicy.existingPolicyData || {}).length}
								</td>
							</tr>
							<tr>
								<td className="pr-2 font-semibold">Type:</td>
								<td>Retail</td>
							</tr>
						</tbody>
					</table>
				</div>
				{Object.entries(existingPolicy.existingPolicyData || {}).map(
					([id, policy]: any) => (
						<div
							key={id}
							className="border-transparent p-3 mt-3 text-sm bg-slate-100 rounded-md"
						>
							<p>
								<strong>ID:</strong> {id}
							</p>
							<p>
								<strong>Plan name:</strong>{" "}
								<span className="font-semibold italic">{policy.otherName}</span>
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
			</section>
		</div>
	);
};

export default Review;

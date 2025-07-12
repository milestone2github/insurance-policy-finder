// utils/export.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
	interface jsPDF {
		lastAutoTable: { finalY: number };
	}
}

interface ExportParams {
	profiles: any;
	personal: any;
	lifestyle: any;
	medicalCondition: any;
	existingPolicy: any;
}

interface Options {
	returnBlob?: boolean;
}

export const exportReviewAsPDF = (
	{
		profiles,
		personal,
		lifestyle,
		medicalCondition,
		existingPolicy,
	}: ExportParams,
	options?: Options
): void | Blob => {
	try {
		const doc = new jsPDF();
		let y = 10;
		const pageHeight = doc.internal.pageSize.getHeight();

		const profileData = profiles?.profileData || {};
		const selectedProfiles = Object.entries(profileData)
			.filter(([_, val]: any) => val.selected)
			.flatMap(([key, val]: any) =>
				val.countable
					? Array.from({ length: val.count }, (_, i) => `${key}-${i + 1}`)
					: [key]
			);

		const getLabel = (key: string) => {
			const baseKey = key.split("-")[0];
			return (
				profileData[baseKey]?.label +
				(key.includes("-") ? ` ${key.split("-")[1]}` : "")
			);
		};

		const getName = (key: string) => personal?.personalInfo?.[key]?.name || key;

		// Section 1: Personal Details
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.text("1. Personal Details", 10, y);
		y += 6;

		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text(
			"Members Covered: " + selectedProfiles.map(getLabel).join(", "),
			10,
			y
		);
		y += 4;

		autoTable(doc, {
			startY: y + 2,
			head: [["Name", "Gender", "DOB"]],
			body: selectedProfiles.map((key) => {
				const info = personal?.personalInfo?.[key] || {};
				return [info.name || "", info.gender || "", info.dob || ""];
			}),
		});
		y = doc.lastAutoTable.finalY + 10;

		// Section 2: Lifestyle
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.text("2. Lifestyle Details", 10, y);
		y += 2;

		doc.setFont("helvetica", "normal");
		autoTable(doc, {
			startY: y + 4,
			head: [["Name", "Fitness", "Alcohol", "Tobacco"]],
			body: selectedProfiles.map((key) => [
				getName(key),
				lifestyle.lifestyleData?.[key] || "—",
				lifestyle.alcoholHistory?.hasHistory &&
				lifestyle.alcoholHistory.alcoholHistoryData?.[key]
					? `Yes (${lifestyle.alcoholHistory.alcoholHistoryData[key]})`
					: "No",
				lifestyle.tobaccoHistory?.hasHistory &&
				lifestyle.tobaccoHistory.tobaccoHistoryData?.[key]
					? `Yes (${lifestyle.tobaccoHistory.tobaccoHistoryData[key]})`
					: "No",
			]),
		});
		y = doc.lastAutoTable.finalY + 10;

		// Section 3: Medical
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.text("3. Medical/Health Details", 10, y);
		y += 2;

		doc.setFont("helvetica", "normal");
		autoTable(doc, {
			startY: y + 4,
			head: [["Name", "Medical History", "Other Illness", "Hospitalised"]],
			body: selectedProfiles.map((key) => {
				const med = medicalCondition.medicalData?.[key];
				const illnesses = med?.selectedIllnesses ?? [];
				const otherIllness = med?.otherIllness?.trim() || "";
				const hospitalisedYear = med?.hospitalisationYear?.trim();
				const hospitalised = hospitalisedYear
					? `Yes (${hospitalisedYear})`
					: "No";

				return [
					getName(key),
					illnesses.length > 0 ? illnesses.join(", ") : "No",
					otherIllness || "No",
					hospitalised,
				];
			}),
		});
		y = doc.lastAutoTable.finalY + 10;

		// Add footer spacing only on first page
		if (doc.getNumberOfPages() === 1 && y > pageHeight - 30) {
			doc.addPage();
			y = 10;
		} else if (doc.getNumberOfPages() === 1) {
			y += 10; // simple footer margin
		}

		// Section 4: Existing Policies
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.text("4. Existing Policy Details", 10, y);
		y += 6;

		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text(
			`Status: ${existingPolicy?.hasExistingPolicy ? "Yes" : "No"}`,
			10,
			y
		);
		doc.text(
			`Count: ${Object.keys(existingPolicy.existingPolicyData || {}).length}`,
			70,
			y
		);
		doc.text("Type: Retail", 130, y);
		y += 8;
		if (existingPolicy?.hasExistingPolicy) {

			const policies = Object.entries(existingPolicy.existingPolicyData || {});
			const colWidth = 90;
			const colPadding = 5;
			let col = 0;
			let x = 10;

			for (let index = 0; index < policies.length; index++) {
				const [id, policy]: any = policies[index];

				// Page break logic
				if (y + 50 > pageHeight - 10) {
					doc.addPage();
					y = 10;
				}

				x = col === 0 ? 10 : 110;

				// Background
				doc.setFillColor(241, 245, 249);
				doc.rect(x, y, colWidth, 45, "F");

				let tempY = y + 5;
				doc.setFont("helvetica", "bold");
				doc.text(`Policy ID: ${id}`, x + colPadding, tempY);
				doc.setFont("helvetica", "normal");
				tempY += 5;
				doc.text(`Policy Name: ${policy.policyName}`, x + colPadding, tempY);
				tempY += 5;
				doc.text(`Plan Name: ${policy.otherName}`, x + colPadding, tempY);
				tempY += 5;
				doc.text(
					`Renewal Date: ${new Date(policy.renewalDate).toLocaleDateString()}`,
					x + colPadding,
					tempY
				);
				tempY += 5;
				doc.text(
					`Cover Amount: ${policy.coverAmount} lacs`,
					x + colPadding,
					tempY
				);
				tempY += 5;
				const members = Array.isArray(policy.coverage)
					? policy.coverage.map(getLabel).join(", ")
					: getLabel(policy.coverage);
				doc.text(`Members: ${members}`, x + colPadding, tempY);

				col = (col + 1) % 2;

				// Move to next row if 2nd column just rendered or at end
				if (col === 0 || index === policies.length - 1) {
					y += 50;
				}
			}

			doc.setDrawColor(200);
			doc.setLineWidth(0.1);
			doc.line(10, y, 200, y);
		}

		// Draw the end-line
		doc.setDrawColor(200);
		doc.setLineWidth(0.1);
		doc.line(10, y, 200, y);

		// Final output
		if (options?.returnBlob) {
			return doc.output("blob");
		} else {
			doc.save("Insurance_Review.pdf");
		}
	} catch (error) {
		console.error("PDF generation failed:", error);
	}
};

import { useState, useEffect } from "react";
import SmallButton from "./SmallButton";
import toast from "react-hot-toast";
import { submitLeadToCRM } from "../../utils/submitLeadToCRM";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { phone: string }) => void;
	// onSubmit: (data: { email: string; phone: string }) => void;
	defaultName: string;
};

const LeadCaptureModal = ({
	isOpen,
	onClose,
	onSubmit,
	defaultName,
}: Props) => {
	// const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const saved = localStorage.getItem("leadDetails");
		if (saved) {
			const parsed = JSON.parse(saved);
			// setEmail(parsed.email || "");
			setPhone(parsed.phone || "");
		}
	}, []);

	if (!isOpen) return null;

/*	const handleContinue = () => {
		// if (!email || !phone) {
		if (!phone) {
			// alert("Valid Phone number is required.");
			toast.error("Valid Phone number is required");
			return;
		}
		const lead = { phone };
		localStorage.setItem("leadDetails", JSON.stringify(lead));
		onSubmit(lead);
	};
*/

const handleContinue = async () => {
	if (!phone || phone.length < 10) {
		toast.error("Valid Phone number is required");
		return;
	}

	const lead = { phone };
	localStorage.setItem("leadDetails", JSON.stringify(lead));

	if (!localStorage.getItem("leadUploaded")) {
		try {
			const {
				profiles,
				personal,
				lifestyle,
				medicalCondition,
				existingPolicy,
			} = window.store.getState();

			await submitLeadToCRM({
				profiles,
				personal,
				lifestyle,
				medicalCondition,
				existingPolicy,
			});

			localStorage.setItem("leadUploaded", "true");
		} catch (err) {
			console.error("Lead upload failed:", err);
		}
	}

	onSubmit(lead);
};

	return (
		<div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center z-50">
			<div className="bg-white rounded p-6 w-full max-w-sm">
				<h2 className="text-lg font-semibold mb-4">
					Get your reports on{" "}
					<span className="font-semibold text-[#25D366]">WhatsApp</span>
				</h2>
				<p className="text-sm mb-4">
					Name: <strong>{defaultName}</strong>
				</p>

				{/* <input
					type="email"
					placeholder="Email"
					className="w-full mb-3 border p-2 rounded"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/> */}
				<div className="w-full mb-4 relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
						+91
					</span>
					<input
						type="tel"
						placeholder="Phone Number"
						className="w-full border p-2 pl-12 rounded"
						value={phone}
						onChange={(e) =>
							setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
						}
						maxLength={10}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<SmallButton onClick={onClose} color="gray" variant="outline">
						Cancel
					</SmallButton>
					<SmallButton onClick={handleContinue} color="darkblue">
						Continue
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default LeadCaptureModal;

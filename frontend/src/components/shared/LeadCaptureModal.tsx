import { useState, useEffect } from "react";
import SmallButton from "./SmallButton";
import toast from "react-hot-toast";
// import { submitLeadToCRM } from "../../utils/submitLeadToCRM";
import { sendWATemplateMessage } from "../../utils/sendWhatsappOtp";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { phone: string }) => void;
	defaultName: string;
};

const LeadCaptureModal = ({
	isOpen,
	onClose,
	onSubmit,
	defaultName,
}: Props) => {
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [serverOtp, setServerOtp] = useState("");
	const [step, setStep] = useState<"phone" | "otp">("phone");

	useEffect(() => {
		const saved = localStorage.getItem("leadDetails");
		if (saved) {
			const parsed = JSON.parse(saved);
			setPhone(parsed.phone || "");
		}
	}, []);

	if (!isOpen) return null;

	const handleContinue = async () => {
		if (step === "phone") {
			if (phone.length !== 10) {
				toast.error("Enter valid 10-digit phone number");
				return;
			}

			const generatedOtp = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			try {
				await sendWATemplateMessage(phone, generatedOtp);
				setServerOtp(generatedOtp);
				toast.success("OTP sent via WhatsApp");
				setStep("otp");
			} catch (err) {
				console.error(err);
				toast.error("Failed to send OTP");
			}
			return;
		}

		// OTP verification
		if (otp !== serverOtp) {
			toast.error("Invalid OTP");
			return;
		}

		const savedLead = JSON.parse(localStorage.getItem("leadDetails") || "{}");
		const lead = { ...savedLead, phone };
		localStorage.setItem("leadDetails", JSON.stringify(lead));
		// localStorage.removeItem("leadUploaded");

		// if (!localStorage.getItem("leadUploaded")) {
		// 	try {
		// 		const {
		// 			profiles,
		// 			personal,
		// 			lifestyle,
		// 			medicalCondition,
		// 			existingPolicy,
		// 		} = window.store.getState();

		// 		await submitLeadToCRM({
		// 			profiles,
		// 			personal,
		// 			lifestyle,
		// 			medicalCondition,
		// 			existingPolicy,
		// 		});

		// 		localStorage.setItem("leadUploaded", "true");
		// 	} catch (err) {
		// 		console.error("Lead upload failed:", err);
		// 	}
		// }

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

				{step === "phone" ? (
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
				) : (
					<input
						type="text"
						placeholder="Enter OTP"
						className="w-full mb-4 border p-2 rounded"
						value={otp}
						onChange={(e) => setOtp(e.target.value.slice(0, 6))}
					/>
				)}

				<div className="flex justify-end gap-2">
					<SmallButton onClick={onClose} color="gray" variant="outline">
						Cancel
					</SmallButton>
					<SmallButton onClick={handleContinue} color="darkblue">
						{step === "phone" ? "Send OTP" : "Verify"}
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default LeadCaptureModal;

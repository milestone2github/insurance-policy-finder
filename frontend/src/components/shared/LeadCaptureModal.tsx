import { useState, useEffect } from "react";
import SmallButton from "./SmallButton";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { email: string; phone: string }) => void;
	defaultName: string;
};

const LeadCaptureModal = ({
	isOpen,
	onClose,
	onSubmit,
	defaultName,
}: Props) => {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const saved = localStorage.getItem("leadDetails");
		if (saved) {
			const parsed = JSON.parse(saved);
			setEmail(parsed.email || "");
			setPhone(parsed.phone || "");
		}
	}, []);

	if (!isOpen) return null;

	const handleContinue = () => {
		if (!email || !phone) {
			alert("Both email and phone number are required.");
			return;
		}
		const lead = { email, phone };
		localStorage.setItem("leadDetails", JSON.stringify(lead));
		onSubmit(lead);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded p-6 w-full max-w-sm">
				<h2 className="text-lg font-semibold mb-4">
					One last step, Enter your contact details...
				</h2>
				<p className="text-sm mb-4">
					Name: <strong>{defaultName}</strong>
				</p>

				<input
					type="email"
					placeholder="Email"
					className="w-full mb-3 border p-2 rounded"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="tel"
					placeholder="Phone Number"
					className="w-full mb-4 border p-2 rounded"
					value={phone}
					onChange={(e) =>
						setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
					}
				/>

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

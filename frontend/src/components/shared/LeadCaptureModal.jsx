import { useState, useEffect } from "react";
import SmallButton from "./SmallButton";
import toast from "react-hot-toast";
import { sendWATemplateMessage } from "../../utils/sendWhatsappOtp";
import { verifyOtp } from "../../utils/verifyOtp";
import axios from "axios";

const LeadCaptureModal = ({ isOpen, defaultName, onClose, onSubmit }) => {
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState("phone");

	const baseUrl = import.meta.env.VITE_API_BASE_URL;

	// Reset modal state on open
	useEffect(() => {
		if (isOpen) {
			setStep("phone");
			setOtp("");
			setPhone("");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleContinue = async () => {
		try {
			let token = localStorage.getItem("authToken");

			if (step === "phone") {
				if (phone.length !== 10) {
					toast.error("Enter valid 10-digit phone number");
					return;
				}

				// Generate token only once
				if (!token) {
					const authTokenRes = await axios.post(`${baseUrl}/api/generate-jwt`, {
						contactNumber: phone,
					});
					token = authTokenRes.data.token;
					localStorage.setItem("authToken", token);
					// console.log("AuthToken created and saved:", token); // debug
				}

				// Send OTP using the token
				await sendWATemplateMessage(token);
				toast.success("OTP sent via WhatsApp");
				setStep("otp");
				return;
			}

			// OTP verification step
			if (step === "otp") {
				if (!otp) {
					toast.error("Please enter the OTP");
					return;
				}

				if (!token) {
					toast.error("Auth token missing. Please restart verification.");
					setStep("phone");
					return;
				}

				const otpVerified = await verifyOtp(token, otp);
				if (!otpVerified) {
					toast.error("Invalid OTP, please try again");
					return;
				}

				onSubmit();
			}
		} catch (error) {
			console.error("Error in LeadCaptureModal:", error);
			toast.error(error.message || "Something went wrong, try again");
		}
	};

	return (
		<div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center z-50">
			<div className="bg-white rounded p-6 w-full max-w-lg">
				<h2 className="text-lg font-semibold mb-4">
					Verify your number and discover the right policy for your needs
				</h2>

				{defaultName && (
					<p className="text-sm mb-4">
						Name: <strong>{defaultName}</strong>
					</p>
				)}

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
						maxLength={6}
					/>
				)}

				<div className="flex justify-end gap-2 mt-6">
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

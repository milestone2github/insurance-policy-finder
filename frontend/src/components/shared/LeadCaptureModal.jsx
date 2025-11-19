import { useState, useEffect } from "react";
import SmallButton from "./SmallButton";
import toast from "react-hot-toast";
import { sendWATemplateMessage } from "../../utils/sendWhatsappOtp";
import { verifyOtp } from "../../utils/verifyOtp";
import axios from "axios";
import { sendDataToDb } from "../../utils/upsertDb";

const LeadCaptureModal = ({ isOpen, defaultName, onClose, onSubmit }) => {
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState("phone");
	const [tempToken, setTempToken] = useState(null); // store token in state
	const isRMFlag = localStorage.getItem("isRM") === "true";
	const rmId = localStorage.getItem("rmId");

	const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

	// Reset modal state on open
	useEffect(() => {
		if (isOpen) {
			setStep("phone");
			setOtp("");
			setPhone("");
			setTempToken(null); // reset temp token each time
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleContinue = async () => {
		try {
			if (step === "phone") {
				if (phone.length !== 10) {
					toast.error("Enter valid 10-digit phone number");
					return;
				}

				// Always generate token for this phone (don't store yet)
				const authTokenRes = await axios.post(`${baseUrl}/api/generate-jwt`, {
					contactNumber: phone,
				});
				const token = authTokenRes.data.token;

				// Directly set client's authToken without OTP verification for RMs
				if (isRMFlag && rmId) {
					// To-Do: validate rmId from backend
					localStorage.setItem("authToken", token);
					const entryType = "rm_assist"; // flag the DB as rm-assist lead type
					await sendDataToDb(1, 0, true, entryType); // fresh user entry open flag
					localStorage.setItem("isDbUpdated", true);
					onSubmit();
					return;
				}

				setTempToken(token); // keep it in memory only

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

				if (!tempToken) {
					toast.error("Session expired. Please restart verification.");
					setStep("phone");
					setOtp("");	// clear otp input field
					return;
				}

				const otpVerified = await verifyOtp(tempToken, otp);
				if (!otpVerified) {
					toast.error("Invalid OTP, please try again");
					setOtp("");	// clear otp input field
					return;
				}

				// Save to localStorage only after OTP success
				localStorage.setItem("authToken", tempToken);
				const entryType = "direct";	// flag the DB as direct lead type
				await sendDataToDb(1, 0, true, entryType);  // fresh user entry open flag
				localStorage.setItem("isDbUpdated", true);
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
							onKeyDown={(e) => e.key === "Enter" && handleContinue()}
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
						onKeyDown={(e) => e.key === "Enter" && handleContinue()}
						maxLength={6}
					/>
				)}

				<div className="flex justify-end gap-2 mt-6">
					<SmallButton onClick={onClose} color="gray" variant="outline">
						Cancel
					</SmallButton>
					<SmallButton onClick={handleContinue} color="darkblue">
						{isRMFlag ? "Continue" : step === "phone" ? "Send OTP" : "Verify"}
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default LeadCaptureModal;

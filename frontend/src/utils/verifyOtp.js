import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const url = baseUrl ? `${baseUrl}/api/otp/validate` : `/api/otp/validate`;

export async function verifyOtp(whatsappNumber, otp) {
  try {
    const response = await axios.post(url, { phone: whatsappNumber, otp });
    console.log('response data : ', response.data);
    if (response.status !== 200) {
      throw new Error(response.data.error || "Failed to verify OTP")
    }
    console.log('after if not status === 200')
    return true;
  } catch (error) {
    console.error('Failed to verify OTP in veirify otp:', error.response?.data.error);
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to verify OTP";

    throw new Error(errorMessage);
  }
}
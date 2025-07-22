import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const url = baseUrl ? `${baseUrl}/api/otp/send` : `/api/otp/send`;

export async function sendWATemplateMessage(whatsappNumber) {
  try {
      const response = await axios.post(url, { phone: whatsappNumber });
      if(!response.data.phone) {
        throw new Error(response.data.error || "Failed to send OTP")
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new Error('Failed to send OTP')
    }
}
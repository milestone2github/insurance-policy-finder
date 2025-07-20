import axios from "axios";
import { WATemplate } from "./constants";

export async function sendWATemplateMessage(whatsappNumber, otp) {
  if (!whatsappNumber) {
    throw new Error('Please provide a valid WhatsApp number');
  }

  // Add +91 if only 10 digits
  if (whatsappNumber.length === 10) {
    whatsappNumber = '+91' + whatsappNumber;
  }

  const url = WATemplate(whatsappNumber);

  const token = import.meta.env.VITE_WA_TOKEN;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const payload = {
    broadcast_name: import.meta.env.VITE_WA_BROADCAST, // Use dynamic if needed
    parameters: [
      {
        name: '1',
        value: `${otp}`,
      },
    ],
    template_name: 'otp_send',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const responseData = response.data;

    // console.log('res data: ', responseData);

    if (!responseData.result) {
      throw new Error('Error sending WhatsApp message');
    }

    if (responseData.hasOwnProperty('validWhatsAppNumber') && !responseData.validWhatsAppNumber) {
      throw new Error(`Provided WhatsApp number ${whatsappNumber} is not valid`);
    }

    return true;
  } catch (error) {
    console.log('error in WA: ', error);
    throw new Error((error).message || 'Unknown error occurred');
  }
}
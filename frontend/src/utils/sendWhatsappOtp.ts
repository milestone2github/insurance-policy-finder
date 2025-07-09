import axios from "axios";

export async function sendWATemplateMessage(whatsappNumber: string, otp: string) {
  if (!whatsappNumber) {
    throw new Error('Please provide a valid WhatsApp number');
  }

  // Add +91 if only 10 digits
  if (whatsappNumber.length === 10) {
    whatsappNumber = '+91' + whatsappNumber;
  }

  const url = `https://live-mt-server.wati.io/302180/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDAzYzE3My1hYzIwLTRiZTQtOTQ0NC03ZjA5NTg5OWZhOTkiLCJ1bmlxdWVfbmFtZSI6ImFjY291bnRzQG5pdmVzaG9ubGluZS5jb20iLCJuYW1laWQiOiJhY2NvdW50c0BuaXZlc2hvbmxpbmUuY29tIiwiZW1haWwiOiJhY2NvdW50c0BuaXZlc2hvbmxpbmUuY29tIiwiYXV0aF90aW1lIjoiMTEvMjkvMjAyNCAxMzowOTowOSIsInRlbmFudF9pZCI6IjMwMjE4MCIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.llRn5yXOuQa5Ehx-_rCSVYzPW7BHl6QGPNRLJ3avxy0'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const payload = {
    broadcast_name: 'otp_send_291120241132', // Use dynamic if needed
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
    throw new Error((error as Error).message || 'Unknown error occurred');
  }
}
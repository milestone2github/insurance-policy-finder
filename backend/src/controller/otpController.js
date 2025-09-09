const OTP = require('../database/models/otp');
const sendWATemplateMessage = require('../utils/sendWhatsappTemplateMessage');

// Generate a 6-digit random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Controller function
const sendOtpViaWhatsApp = async (req, res) => {
  try {
    // let { phone } = req.body;
    const phone = req.contactNumber;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otpCode = generateOTP();
    
    // Save OTP to DB (auto-expires in 5 minutes)
    await OTP.create({ phone, otp: otpCode });

    // send OTP via whatsapp 
    const sentWhatsAppMessage  = await sendWATemplateMessage(phone, otpCode)

    if (!sentWhatsAppMessage) {
      return res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }

    return res.status(200).json({ message: 'OTP sent successfully via WhatsApp' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const phone = req.contactNumber;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    // Find the most recent OTP for the phone
    const existingOtp = await OTP.findOne({ phone, otp });

    if (!existingOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid; delete it (optional)
    await OTP.deleteOne({ _id: existingOtp._id });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  sendOtpViaWhatsApp,
  verifyOtp
};
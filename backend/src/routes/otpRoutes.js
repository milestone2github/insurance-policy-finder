const { Router } = require("express");
const { sendOtpViaWhatsApp, verifyOtp } = require("../controller/otpController");
const otpRoutes = Router();

otpRoutes.post('/send', sendOtpViaWhatsApp);
otpRoutes.post('/validate', verifyOtp);

module.exports = otpRoutes;
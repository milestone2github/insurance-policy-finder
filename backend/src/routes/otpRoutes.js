const { Router } = require("express");
const { sendOtpViaWhatsApp, verifyOtp } = require("../controller/otpController");
const verifyJWT = require("../middleware/verifyToken");
const otpRoutes = Router();

otpRoutes.post('/send', verifyJWT, sendOtpViaWhatsApp);
otpRoutes.post('/validate', verifyJWT, verifyOtp);

module.exports = otpRoutes;
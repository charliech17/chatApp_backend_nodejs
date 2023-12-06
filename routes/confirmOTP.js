const express = require('express');
const router = express.Router();
const confirmControl = require("../controlls/confirmOTP")

router.post(`/${process.env.CONFIRM_OTP_KEY}`,confirmControl.confirmOTP)

module.exports = router;
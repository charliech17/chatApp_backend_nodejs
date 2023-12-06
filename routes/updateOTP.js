const express = require('express');
const router = express.Router();
const updateControl = require('../controlls/updateOTP')

router.post(`/${process.env.UPDATE_OTP_KEY}`, updateControl.updateUserOTP);

module.exports = router;
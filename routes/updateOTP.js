const express = require('express');
const router = express.Router();
const updateControl = require('../controlls/updateOTP')
// TODO update OTP route


router.get(`/${process.env.UPDATE_OTP_KEY}`, updateControl.updateUserOTP);

module.exports = router;
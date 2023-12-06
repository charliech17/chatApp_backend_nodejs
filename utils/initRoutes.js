const updateOTP_route  = require('../routes/updateOTP');
const confirmOTP_route = require('../routes/confirmOTP')

class initRoutes {
    constructor(app) {
        app.use(`/${process.env.UPDATE_OTP_ROUTE}`, updateOTP_route);
        app.use(`/${process.env.CONFIRM_OTP_ROUTE}`, confirmOTP_route);
    }
}

module.exports = initRoutes
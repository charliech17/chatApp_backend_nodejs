const updateOTP_route  = require('../routes/updateOTP');

class initRoutes {
    constructor(app) {
        app.use(`/${process.env.UPDATE_OTP_ROUTE}`, updateOTP_route);
    }
}

module.exports = initRoutes
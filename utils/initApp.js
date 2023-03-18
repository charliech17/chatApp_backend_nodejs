const bodyParser = require('body-parser');
const helmet     = require('helmet');

class initApp {
    constructor(app) {
        app.use(helmet());
        app.use(bodyParser.json());
        this.initCorsSetting(app)
    }

    initCorsSetting(app) {
        app.use((req, res, next) => {
            const corsWhitelist = [
                process.env.LOCAL_PORT,
            ];
            if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            }
            next();
        });
    }
}

module.exports = initApp
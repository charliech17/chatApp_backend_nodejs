// @ import
// const bodyParser = require('body-parser');
// const helmet     = require('helmet');
const express    = require('express');
const app        = express();
const initApp    = require('./utils/initApp')
const initRoutes = require('./utils/initRoutes')


// @ 設定
new initApp(app)
new initRoutes(app)
// app.use(helmet());
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//     const corsWhitelist = [
//         process.env.secrectWebSite,
//         process.env.secretRevivalPage,
//         process.env.localPort,
//     ];
//     if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
//         res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//         res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     }
//     next();
// });


// @ route相關
// const updateOTP  = require('/routes/updateOTP');

// app.use(`/${process.env.secretMainRoute}`, updateOTP);
// app.use(`/${process.env.LocalURL}`, localRoutes);


// @ 監聽
app.listen(process.env.PORT || 4000);
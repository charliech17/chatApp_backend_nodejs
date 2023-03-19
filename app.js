// @ import
// const bodyParser = require('body-parser');
// const helmet     = require('helmet');
const express    = require('express');
const { createServer } = require("http");
const app        = express();
const httpServer = createServer(app);
const initApp    = require('./utils/initApp')
const initRoutes = require('./utils/initRoutes')
const initSocketIO = require('./utils/initSocket_IO')


// @ 設定
new initApp(app)
new initRoutes(app)
new initSocketIO(httpServer)


// @ 監聽
httpServer.listen(process.env.PORT || 4000);
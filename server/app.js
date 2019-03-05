require('../config/redis-setup'); // initialize redis client
const express = require('express');
const bodyParser = require('body-parser');
const { checkReqBody } = require('./middleware/check-req-body');
const { handle404Error } = require('./middleware/error-handler/handle-404');
const { checkRedis } = require('./middleware/check-redis');
const { cors } = require('./middleware/cors');
const apiRouter = require('./api/api.router');


const app = express();

app.use(cors);
app.use(checkRedis); // Redis always have to be turn on
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkReqBody);
app.use('/', apiRouter);
app.use(handle404Error);


module.exports = app;

const express = require('express');
const exchangeRouter = require('./exchange/exchange.router');


const router = express.Router();

router.use('/exchange', exchangeRouter);


module.exports = router;

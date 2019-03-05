const express = require('express');
const { exchange } = require('./exchange.controller');
const { validateReqBody } = require('./exchange.validator');


const router = express.Router();

router.post('/', validateReqBody, exchange);


module.exports = router;

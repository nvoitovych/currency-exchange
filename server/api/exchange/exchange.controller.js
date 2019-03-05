const { convertDateFormat } = require('../../helpers/utils');
const { redisClient } = require('../../../config/redis-setup');
const { exchangeValue, loadCurrencyRate } = require('../../services/exchange.service');


const exchange = async (req, res) => {
  let rateInfo;
  const convertedDate = await convertDateFormat(new Date());

  // return rate of string type
  const cachedRate = await redisClient.getAsync(`${convertedDate}`).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof cachedRate === 'undefined') return;

  if (cachedRate) {
    try {
      rateInfo = JSON.parse(cachedRate);
    } catch (error) {
      res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      return;
    }
  } else {
    // return rate of JSON type
    const loadingResult = await loadCurrencyRate().catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
    if (typeof loadingResult === 'undefined') return;
    rateInfo = loadingResult;
  }

  const exchangeOpts = { ...req.app.locals, ...rateInfo };
  const exchangedValue = await exchangeValue(exchangeOpts).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof exchangedValue === 'undefined') return;

  res.status(200).send({ result: exchangedValue });
};


module.exports = {
  exchange,
};

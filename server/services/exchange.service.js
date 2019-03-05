const axios = require('axios');
const { redisClient } = require('../../config/redis-setup');
const { getCurrentUrl, convertDateFormat } = require('../helpers/utils');


/*
Format of response.data:
[ { r030: 840,
    txt: 'Долар США',
    rate: 27.017312,
    cc: 'USD',
    exchangedate: '25.02.2019' } ]
*/
const loadCurrencyRate = async () => {
  const currentUrl = await getCurrentUrl();

  const responseJSON = await axios.get(currentUrl).catch((error) => {
    switch (error.code) {
      default: {
        throw error;
      }
    }
  });
  if (typeof responseJSON === 'undefined') return undefined;

  const convertedDate = await convertDateFormat(new Date());
  const rateInfo = { rate: responseJSON.data[0].rate, currencyCode: responseJSON.data[0].cc };
  redisClient.setex(`${convertedDate}`, 3600 * 24, JSON.stringify(rateInfo));
  return rateInfo;
};

const exchangeValue = async ({
  value, currencyTo, rate,
}) => {
  let result = 0.0;

  if (typeof rate === 'number') {
    if (rate <= 0) throw Error('rate should be bigger than 0');
  } else {
    throw Error('rate should be number');
  }

  if (typeof value === 'number') {
    if (value < 0) throw Error('value should be bigger or equel to 0');
  } else {
    throw Error('value should be number');
  }

  if (currencyTo === 'UAH') result = value * rate;
  else result = value / rate;

  return result;
};


module.exports = {
  exchangeValue,
  loadCurrencyRate,
};

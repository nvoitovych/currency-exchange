/* eslint-disable no-console */
const { redisClient } = require('../../config/redis-setup');


const checkRedis = async (req, res, next) => {
  if (typeof redisClient === 'undefined') {
    res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    return;
  }

  next();
};


module.exports = {
  checkRedis,
};

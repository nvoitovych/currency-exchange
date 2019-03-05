const Joi = require('joi');


const validateReqBody = async (req, res, next) => {
  const { currencyFrom, currencyTo, value } = req.body;

  const currencyFromSchema = Joi.object().keys({
    currencyFrom: Joi.string().valid('USD', 'UAH').insensitive().lowercase()
      .strict()
      .optional(),
  });
  const currencyToSchema = Joi.object().keys({
    currencyTo: Joi.string().valid('USD', 'UAH').insensitive().lowercase()
      .strict()
      .required(),
  });
  const valueSchema = Joi.object().keys({
    value: Joi.number().min(0).strict().required(),
  });

  const currencyFromValidationResult = await Joi.validate({ currencyFrom }, currencyFromSchema)
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError': {
          res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid "currencyFrom" field' }));
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof currencyFromValidationResult === 'undefined') return;

  const currencyToValidationResult = await Joi.validate({ currencyTo }, currencyToSchema)
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError': {
          res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid "currencyTo" field' }));
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof currencyToValidationResult === 'undefined') return;

  const valueValidationResult = await Joi.validate({ value }, valueSchema)
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError': {
          res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid value' }));
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof valueValidationResult === 'undefined') return;

  if (typeof currencyFrom !== 'undefined') req.app.locals.currencyFrom = currencyFrom.toUpperCase();
  req.app.locals.currencyTo = currencyTo.toUpperCase();
  req.app.locals.value = value;
  next();
};


module.exports = {
  validateReqBody,
};

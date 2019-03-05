require('dotenv').config({ debug: true, path: './config/test.env' }); // Set up Environment

const request = require('supertest');
const Joi = require('joi');
const app = require('../server/app');
const { redisClient } = require('../config/redis-setup');


//= =================== API test ====================

/**
 * Testing POST exchange endpoint
 */
describe('POST /exchange', () => {
  let server;
  // Manually close redis connection after test is finished
  // redis client creates when app is used first time
  afterAll(async () => {
    await new Promise((resolve) => {
      redisClient.quit(() => {
        resolve();
      });
    });
    // redis.quit() creates a thread to close the connection.
    // We wait until all threads have been run once to ensure the connection closes.
    await new Promise(resolve => setImmediate(resolve));
    // eslint-disable-next-line no-console
    console.log('Redis Connection is closed.');
  });

  beforeAll((done) => {
    // set server port and supertest agent manually
    // eslint-disable-next-line consistent-return
    server = app.listen(4000, (err) => {
      if (err) return done(err);
      request.agent(server);
      done();
    });
  });

  // manually close server
  afterAll(done => server && server.close(done));

  const isValidResponse = async (resBody) => {
    const { result } = resBody;

    const resultSchema = Joi.object().keys({
      result: Joi.number().min(0).required(),
    });
    const resultValidationResult = await Joi.validate({ result }, resultSchema).catch();
    // eslint-disable-next-line no-useless-return
    if (typeof resultValidationResult === 'undefined') throw new Error();
  };

  /*
  1) Data validation schema:
    const currencyFromSchema = Joi.object().keys({
      currencyFrom: Joi.string().valid('USD', 'UAH').insensitive().lowercase()
        .optional(),
    });
    const currencyToSchema = Joi.object().keys({
      currencyTo: Joi.string().valid('USD', 'UAH').insensitive().lowercase()
        .required(),
    });
    const valueSchema = Joi.object().keys({
      value: Joi.number().min(0).required(),
    });

  2) Full valid data JSON example:
  {
    value: 1,
    currencyTo: 'UAH',
    currencyFrom: 'USD'
  }
   */
  it('respond with json containing a result field(exchanged value) | Request to exchange USD on UAH', async (done) => {
    const data = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
    };

    const result = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    await isValidResponse(result.body).catch((error) => {
      done(error);
    });
    done();
  });

  it('respond with json containing a result field(exchanged value) | Request to exchange UAH on USD', async (done) => {
    const data = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const result = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    await isValidResponse(result.body).catch((error) => {
      done(error);
    });
    done();
  });

  it('respond with json containing a result field(exchanged value) | Request to exchange USD on UAH | NO currencyFrom passed', async (done) => {
    const data = {
      value: 1,
      currencyTo: 'UAH',
      // NO currencyFrom
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(200);
    await isValidResponse(response.body).catch((error) => {
      done(error);
    });
    done();
  });

  it('respond with json containing a result field(exchanged value) | Request to exchange UAH on USD | NO currencyFrom passed', async (done) => {
    const data = {
      value: 1,
      currencyTo: 'USD',
      // NO currencyFrom
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(200);
    await isValidResponse(response.body).catch((error) => {
      done(error);
    });
    done();
  });

  it('respond with 400 "Invalid value" | NO value passed', async () => {
    const data = {
      // no value
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 BAD_REQUEST | NO value, currencyTo passed', async () => {
    const data = {
      // no value
      // no currencyTo
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('respond with 400 BAD_REQUEST | NO value, currencyFrom passed', async () => {
    const data = {
      // no value
      // no currencyFrom
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('respond with 400 BAD_REQUEST | NO value, currencyTo, currencyFrom(empty object) passed', async () => {
    const data = {
      // no value
      // no currencyTo
      // no currencyFrom
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('respond with 400 BAD_REQUEST | NO data passed passed', async () => {
    const response = await request(server)
      .post('/exchange')
      .send() // NO data passed
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('respond with 400 "Invalid value" | value less 0 is passed', async () => {
    const data = {
      value: -10,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value null is passed', async () => {
    const data = {
      value: null,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value undefined is passed', async () => {
    const data = {
      value: undefined,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string("0") is passed', async () => {
    const data = {
      value: '0',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string("1") is passed', async () => {
    const data = {
      value: '1',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string("-1") is passed', async () => {
    const data = {
      value: '-1',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string("0.0") is passed', async () => {
    const data = {
      value: '0.0',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string("Aa") is passed', async () => {
    const data = {
      value: 'Aa',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof string(empty) is passed', async () => {
    const data = {
      value: '',
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | value typeof boolean is passed', async () => {
    const data = {
      value: true,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid value');
  });

  it('respond with 400 "Invalid value" | NO currencyTo passed', async () => {
    const data = {
      value: 1,
      // NO currencyTo
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo number type is passed', async () => {
    const data = {
      value: 1,
      currencyTo: 24,
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo null is passed', async () => {
    const data = {
      value: 1,
      currencyTo: null,
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo undefined is passed', async () => {
    const data = {
      value: 1,
      currencyTo: undefined,
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo wrong string("WRONG CODE" length=10) is passed', async () => {
    const data = {
      value: 1,
      currencyTo: 'WRONG CODE',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo wrong string("WRO" length=3) is passed', async () => {
    const data = {
      value: 1,
      currencyTo: 'WRO',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 "Invalid value" | currencyTo empty string is passed', async () => {
    const data = {
      value: 1,
      currencyTo: '',
      currencyFrom: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyTo" field');
  });

  it('respond with 400 \'Invalid "currencyFrom" field\' | currencyFrom number type is passed', async () => {
    const data = {
      value: 1,
      currencyFrom: 24,
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyFrom" field');
  });

  it('respond with 400 \'Invalid "currencyFrom" field\'" | currencyFrom null is passed', async () => {
    const data = {
      value: 1,
      currencyFrom: null,
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyFrom" field');
  });

  it('respond with 400 \'Invalid "currencyFrom" field\' | currencyFrom wrong string("WRONG CODE" length=10) is passed', async () => {
    const data = {
      value: 1,
      currencyFrom: 'WRONG CODE',
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyFrom" field');
  });

  it('respond with 400 \'Invalid "currencyFrom" field\' | currencyFrom wrong string("WRO" length=3) is passed', async () => {
    const data = {
      value: 1,
      currencyFrom: 'WRO',
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyFrom" field');
  });

  it('respond with 400 \'Invalid "currencyFrom" field\' | currencyFrom empty string is passed', async () => {
    const data = {
      value: 1,
      currencyFrom: '',
      currencyTo: 'UAH',
    };

    const response = await request(server)
      .post('/exchange')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid "currencyFrom" field');
  });
}); // 27 errors,

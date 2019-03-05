/* eslint-disable no-console */
const { exchangeValue } = require('./exchange.service');


describe('exchangeValue() function:', () => {
  test('exchange 1 UAH to USD with rate=100 to equal 0.01', async () => {
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.01);
  });

  test('exchange 1 USD to UAH with rate=100 to equal 100', async () => {
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(100);
  });

  test('exchange 1.0 UAH to USD with rate=100 to equal 0.01', async () => {
    const params = {
      value: 1.0,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.01);
  });

  test('exchange 1.0 USD to UAH with rate=100 to equal 100.0', async () => {
    const params = {
      value: 1.0,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(100.0);
  });

  test('exchange 0.0 UAH to USD with rate=100 to equal 0.0', async () => {
    const params = {
      value: 0.0,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.0);
  });

  test('exchange 0.0 USD to UAH with rate=100 to equal 0.0', async () => {
    const params = {
      value: 0.0,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.0);
  });

  test('exchange 0.00000 UAH to USD with rate=100 to equal 0.0', async () => {
    const params = {
      value: 0.00000,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.0);
  });

  test('exchange 0.00000 USD to UAH with rate=100 to equal 0.0', async () => {
    const params = {
      value: 0.00000,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.0);
  });

  test('exchange 1 UAH to USD with rate=100 & WITHOUT currencyFrom to equal 0.01', async () => {
    const params = {
      value: 1,
      currencyTo: 'USD',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(0.01);
  });

  test('exchange 1 USD to UAH with rate=100 & WITHOUT currencyFrom to equal 100', async () => {
    const params = {
      value: 1,
      currencyTo: 'UAH',
      rate: 100,
    };

    expect(await exchangeValue(params)).toEqual(100);
  });

  test('exchange 1 UAH to USD with rate=1000000000000000000000000000000(20 digits) to equal 1000000000000000000000000000000', async () => {
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 1000000000000000000000000000000,
    };
    expect(await exchangeValue(params)).toEqual(1000000000000000000000000000000);
  });

  test('Should throw Error with message "rate should be bigger than 0" when rate=0&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('rate should be bigger than 0');
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 0,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be bigger than 0" when rate=0&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('rate should be bigger than 0');
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 0,
    };

    expect(exchangeValue(params)).rejects.toEqual(expectedError);
  });

  test('Should throw Error with message "rate should be bigger than 0" when rate=0.0&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('rate should be bigger than 0');
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 0.0,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be bigger than 0" when rate=0.0&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('rate should be bigger than 0');
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 0.0,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value cannot be null" when value=null&rate=100&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      value: null,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value should be number" when value=null&rate=100&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      value: null,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value should be number" when value=undefined&rate=100&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      value: undefined,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value should be number" when value=undefined&rate=100&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      value: undefined,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when rate=null&value=1&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: null,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when rate=null&value=1&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: null,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when rate=undefined&value=1&currencyTo="UAH" was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: undefined,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when rate=undefined&value=1&currencyTo="USD" was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: undefined,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when value=1&currencyTo="UAH" & WITHOUT rate was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'UAH',
      currencyFrom: 'USD',
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "rate should be number" when value=1&currencyTo="USD" & WITHOUT rate  was passed', async () => {
    const expectedError = new Error('rate should be number');
    const params = {
      value: 1,
      currencyTo: 'USD',
      currencyFrom: 'UAH',
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value should be number" when rate=100&currencyTo="UAH" & WITHOUT value was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      currencyTo: 'UAH',
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "value should be number" when rate=100&currencyTo="USD" & WITHOUT value was passed', async () => {
    const expectedError = new Error('value should be number');
    const params = {
      currencyTo: 'USD',
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toThrow(expectedError);
  });

  test('Should throw Error with message "currencyTo should be passed" when currencyTo=undefined&rate=100&value=1 was passed', async () => {
    const expectedError = new Error('currencyTo should be passed');
    const params = {
      value: 1,
      currencyTo: undefined,
      currencyFrom: 'USD',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toEqual(expectedError);
  });

  test('Should throw Error with message "currencyTo should be passed" when rate=100&value=1 & WITHOUT currencyTo was passed', async () => {
    const expectedError = new Error('currencyTo should be passed');
    const params = {
      value: 1,
      currencyFrom: 'UAH',
      rate: 100,
    };

    expect(exchangeValue(params)).rejects.toEqual(expectedError);
  });

  test('Should throw Error when rate=undefined&value=undefined&currencyTo=undefined was passed', async (done) => {
    const params = {
      value: undefined,
      currencyTo: undefined,
      rate: undefined,
    };

    const result = exchangeValue(params);
    await expect(result).rejects.toBeInstanceOf(Error).catch(e => done(e));
    done();
  });

  test('Should throw Error when NO params fields in obj was passed', async (done) => {
    const params = {};

    const result = exchangeValue(params);
    await expect(result).rejects.toBeInstanceOf(Error).catch(e => done(e));
    done();
  });

  test('Should throw TypeError when NO params obj was passed', async (done) => {
    const result = exchangeValue();
    await expect(result).rejects.toBeInstanceOf(TypeError).catch(e => done(e));
    done();
  });
});

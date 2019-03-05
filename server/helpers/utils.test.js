const { convertDateFormat, validateEnvSync } = require('./utils');


describe('convertDateFormat() function:', () => {
  test('convert Date("2019/1/1") to equal 20190101', async () => {
    const testDate = new Date('2019/1/1');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('20190101');
  });

  test('convert Date("2019-01-01") to equal 20190101', async () => {
    const testDate = new Date('2019-01-01');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('20190101');
  });

  test('convert Date("2019-1-10") to equal 20190110', async () => {
    const testDate = new Date('2019-1-10');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('20190110');
  });

  test('convert Date("2019-12-24") to equal 20191224', async () => {
    const testDate = new Date('2019-12-24');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('20191224');
  });

  test('convert Date("0/1/1") to equal 20000101', async () => {
    const testDate = new Date('0/1/1');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('20000101');
  });

  test('convert Date("1990/1/1") to equal 19900101', async () => {
    const testDate = new Date('1990/1/1');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('19900101');
  });

  test('convert Date("2345/1/1") to equal 23450101', async () => {
    const testDate = new Date('2345/1/1');
    const convertedDate = await convertDateFormat(testDate);
    expect(convertedDate).toEqual('23450101');
  });
});

describe('validateEnvSync() function:', () => {
  test('Should throw TypeError when NO params were passed', async () => {
    expect(() => {
      validateEnvSync();
    }).toThrow(TypeError);
  });

  test('Should throw Error with message "Set up all Env variables" when EMPTY params obj was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {};
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when STRING was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = 'invalid type of param';
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY port was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      PORT: 3000,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY REDIS_PORT was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_PORT: 3000,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY REDIS_URL was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_URL: 'sskksks',
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY empty string REDIS_URL was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_URL: '',
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY NULL REDIS_URL was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_URL: null,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY NULL PORT was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      PORT: null,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when ONLY NULL REDIS_PORT was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_PORT: null,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when obj with ONLY one port(wrong field name: PORT vs port) was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      port: 3000,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when obj with ONLY one port(wrong field name: PORT vs PorT) was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      PorT: 3000,
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when obj with wrong field name(PORT vs PorT) was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      PorT: 3000,
      REDIS_PORT: 8000,
      REDIS_URL: '127.0.0.1',
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should throw Error with message "Set up all Env variables" when obj without PORT was passed', async () => {
    const expectedError = new Error('Set up all Env variables');
    const env = {
      REDIS_PORT: 8000,
      REDIS_URL: '127.0.0.1',
    };
    expect(() => {
      validateEnvSync(env);
    }).toThrow(expectedError);
  });

  test('Should return null when param obj with valid PORT, REDIS_PORT and REDIS_URL was passed', async () => {
    const env = {
      PORT: 3000,
      REDIS_PORT: 8000,
      REDIS_URL: '127.0.0.1',
    };
    expect(validateEnvSync(env)).toEqual(null);
  });
});

# Currency exchange API

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Simple currency exchange app between 'USD' and 'UAH'. 
App uses 'bank.gov.ua' API to get current currency rates. 

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Tests](#tests)
- [Deployment](#deployment)
- [API](#api)
- [Built With](#built-with)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

node.js v8 or higher, redis


### Installing

Download project

```
got clone 'https://github.com/ShellyShelly/currency-exchange.git'
```

Open project directory

```
cd currency-exchange-clone
```

Download all dependencies
```
npm install
```

Copy example.env, rename to development.env and setup all settings(REDIS_PORT, REDIS_URL and server PORT).
<br>example.env file:
```
PORT=8080
REDIS_PORT=6379
REDIS_URL='127.0.0.1'
```

Start redis on setted REDIS_PORT.
```
redis-server --port 6380
```
Run server in development mode on port 8080
```
npm run start:dev
```

## Tests

### Running the tests

Run e2e tests
```
npm run test:e2e
```

Run unit tests
```
npm run test
```

Get unit test coverage
```
npm run coverage
```

Get e2e test coverage
```
npm run coverage:e2e
```

### Coding style tests(lint)

Check coding style guide setted in .eslintrc file

```
npm run lint
```

## Deployment
// TODO: Add additional notes about how to deploy this on a live system

## Versioning
#### Any optional sections

## API
POST /exchange/
```
{
	"value": number,
	"currencyTo": string_currency_3_char_code,
	"currencyFrom": string_currency_3_char_code,
}
```
Field 'value' should be not negative(float or integer).
<br>Fields 'currencyFrom' and 'currencyTo' should be string alike 'USD' or 'UAH'(case insensitive).
<br>Field 'currencyFrom' is optional.

<br>Example 1:
```
{
	"value": 100,
	"currencyTo": "UAH",
	"currencyFrom": "USD"
}
```
Change 100 'USD' to 'UAH'

<br>Example 2:
```
{
	"value": 100.0,
	"currencyTo": "uAh",
}
```
Change 100.0 'USD' to 'UAH'

<br>Example response:
```
{
	"result": 2682.7083
}
```

## Built With

* [Express.js](https://expressjs.com) - The web framework used
* [Node.js](https://nodejs.org/en/) - The JavaScript runtime
* [Redis](https://redis.io) -  In-memory data structure store(for caching)
* [JOI](https://github.com/hapijs/joi) - Object schema validation
* [Dotenv](https://www.npmjs.com/package/dotenv) - Module that loads environment variables
* [Bluebird](http://bluebirdjs.com/docs/getting-started.html) - Third party promise library
* [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client
* [Jest](https://jestjs.io) - JavaScript Testing Framework
* [Supertest](https://www.npmjs.com/package/supertest) - Library made specifically for testing nodejs http servers,

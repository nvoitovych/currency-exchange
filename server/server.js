/* eslint-disable import/order */
const app = require('./app');
const { validateEnvSync } = require('./helpers/utils');


const { NODE_ENV } = process.env;
let envConfigPath;

/*
NOTE: When you run `node server.js`, the current working directory is `/home/myapp/`
so your file is found. When your upstart script runs or you run `node /home/myapp/server.js`,
the current working directory is whatever `pwd` returns
console.log('Current Working Directory: ', process.cwd());
*/
switch (NODE_ENV) {
  case 'development': {
    envConfigPath = './config/development.env';
    break;
  }
  case 'production': {
    envConfigPath = './config/production.env';
    break;
  }
  default: {
    envConfigPath = './config/.env';
  }
}
const { error, parsed } = require('dotenv').config({ debug: true, path: envConfigPath });

if (typeof error !== 'undefined') {
// eslint-disable-next-line no-console
  console.log('Error on server started with dotenv:\n', error);
  throw Error;
}

validateEnvSync(parsed);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`NODE_ENV is ${process.env.NODE_ENV}\nServer is running on port ${port}...\n`);
});


module.exports = server;

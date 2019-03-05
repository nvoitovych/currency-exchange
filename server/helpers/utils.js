const URL_TEMPLATE = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';


const convertDateFormat = async (date) => {
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const mm = m < 10 ? `0${m}` : m;
  const dd = d < 10 ? `0${d}` : d;
  return `${yyyy}${mm}${dd}`;
};

const getCurrentUrl = async () => {
  const now = new Date();
  const formattedDate = await convertDateFormat(now);
  return `${URL_TEMPLATE}?valcode=USD&date=${formattedDate}&json`;
};

const validateEnvSync = ({ PORT, REDIS_PORT, REDIS_URL }) => {
  if (PORT === null || REDIS_PORT === null || REDIS_URL === null
    || PORT === '' || REDIS_PORT === '' || REDIS_URL === ''
    || typeof PORT === 'undefined' || typeof REDIS_PORT === 'undefined' || typeof REDIS_URL === 'undefined'
  ) {
    throw Error('Set up all Env variables');
  }
  return null;
};


module.exports = {
  convertDateFormat,
  getCurrentUrl,
  validateEnvSync,
};

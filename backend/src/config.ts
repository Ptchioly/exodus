export const secrets = {
  SECRET_SESSION: process.env.SECRET_SESSION,
  ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.AWS_REGION,
  SESSION_TOKEN: process.env.SESSION_TOKEN,
  PASSPHRASE: process.env.PASSPHRASE,
};

export const configs = {
  HTTPS_PORT: 443,
  HTTP_PORT: 8000,
  USER_TABLE: 'users',
  MAX_AGE: 86400000,
  CURRENCY_CODE: {
    980: 'UAH',
    985: 'PLN',
    840: 'USD',
    978: 'EUR',
  },
};

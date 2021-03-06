import { resolve } from 'path';
require('dotenv').config({ path: resolve('../../.env') });

export const secrets = {
  SECRET_SESSION: process.env.SECRET_SESSION,
  ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.AWS_REGION,
  SESSION_TOKEN: process.env.SESSION_TOKEN,
  TELEGRAM_BOT_ID: process.env.TELEGRAM_BOT_ID,
};

export const configs = {
  ORIGINS: [
    'http://localhost:5000',
    'https://beeeee.es',
    'https://www.beeeee.es',
    'https://staging.beeeee.es',
  ],
  HTTP_PORT: 8080,
  MAX_AGE: 86400000,
  CURRENCY_CODE: {
    980: 'UAH',
    985: 'PLN',
    840: 'USD',
    978: 'EUR',
  },
};

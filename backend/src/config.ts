export const secrets = {
  SECRET_SESSION: process.env.SECRET_SESSION,
  ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.AWS_REGION,
  SESSION_TOKEN: process.env.SESSION_TOKEN,
};

export const configs = {
  PORT: '8081',
  USER_TABLE: 'users',
  MAX_AGE: 86400000,
  DYNAMO_OPTS: {
    table: 'sessions',
    AWSConfigJSON: {
      accessKeyId: secrets.ACCESS_KEY,
      secretAccessKey: secrets.SECRET_ACCESS_KEY,
      region: secrets.REGION,
    },
    readCapacityUnits: 1,
    writeCapacityUnits: 1,
  },
  CURRENCY_CODE: {
    980: 'UAH',
    985: 'PLN',
    840: 'USD',
    978: 'EUR',
  },
};

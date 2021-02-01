require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { statement } from './routes/monobank/statement';
import { login } from './routes/auth/login';
import { configs, secrets } from './config';
import session from 'express-session';
import { signup } from './routes/auth/signup';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import aws from 'aws-sdk';
const DynamoDBStore = require('connect-dynamodb')(session);

aws.config.update({
  region: secrets.REGION,
  accessKeyId: secrets.ACCESS_KEY,
  secretAccessKey: secrets.SECRET_ACCESS_KEY,
});

const logging = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.url, req.method);
  next();
};

export const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    store: new DynamoDBStore(configs.DYNAMO_OPTS),
    secret: secrets.SECRET_SESSION!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: configs.MAX_AGE, // 1 day
    },
  })
);

app.use(logging);
app.use(login);
app.use(signup);
app.use(statement);
app.get('/', (req, res) => {
  res.send('CHOKAVO');
});

app.listen(configs.PORT, () => {
  console.log(`Server is running at port ${configs.PORT}`);
});

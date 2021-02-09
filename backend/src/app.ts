require('dotenv').config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import { resolve } from 'path';
import { configs, secrets } from './config';
import { login } from './routes/auth/login';
import { logout } from './routes/auth/logout';
import { signup } from './routes/auth/signup';
import { authentication } from './routes/auth/validate';
import { personalInfo } from './routes/monobank/personal';
import { statement } from './routes/monobank/statement';
import { deleteUser } from './routes/settings/deleteUser';
import { updateInfo } from './routes/settings/updateInfo';
import { logging } from './utils';

const cert = readFileSync(resolve('./ssl/Certificate.crt'));
const ca = readFileSync(resolve('./ssl/Certificate_chain.ca-bundle'));
const key = readFileSync(resolve('./ssl/private_key.key'));

export const app = express();

const defaultRoute = (req: Request, res: Response): void => {
  res.status(200);
};

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://ptchioly.github.io/exodus'],
    credentials: true,
  })
);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(logging);
app.use(login);
app.use(signup);
app.use(logout);
app.use(statement);
app.use(personalInfo);
app.use(authentication);
app.use(updateInfo);
app.use(deleteUser);
app.get('/', defaultRoute);

const options = {
  cert,
  ca,
  key,
  passphrase: secrets.PASSPHRASE,
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(configs.HTTP_PORT, () =>
  console.log(`Listen http on ${configs.HTTP_PORT}`)
);
httpsServer.listen(configs.HTTPS_PORT, () => {
  console.log(`Listen https on ${configs.HTTPS_PORT}`);
});

require('dotenv').config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { configs } from './config';
import { login } from './routes/auth/login';
import { logout } from './routes/auth/logout';
import { signup } from './routes/auth/signup';
import { authentication } from './routes/auth/validate';
import { statement } from './routes/monobank/statement';
import { personalInfo } from './routes/monobank/personal';
import { logging } from './utils';
import { updateInfo } from './routes/settings/updateInfo';
import { deleteUser } from './routes/settings/deleteUser';

export const app = express();

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

app.listen(configs.PORT, () => {
  console.log(`Server is running at port ${configs.PORT}`);
});

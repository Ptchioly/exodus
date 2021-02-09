require('dotenv').config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { configs } from './config';
import { login } from './routes/auth/login';
import { logout } from './routes/auth/logout';
import { signup } from './routes/auth/signup';
import { authentication } from './routes/auth/validate';
import { personalInfo } from './routes/monobank/personal';
import { statement } from './routes/monobank/statement';
import { deleteUser } from './routes/settings/deleteUser';
import { updateInfo } from './routes/settings/updateInfo';
import { logging } from './utils';

export const app = express();

const defaultRoute = (req: Request, res: Response): void => {
  res.status(200).send('Lets beee 🐝🐝🐝🐝');
};

app.use(
  cors({
    origin: [
      'http://localhost:5000',
      'https://ptchioly.github.io/exodus',
      'https://ptchioly.github.io',
      'http://beeeee.es',
      'https://beeeee.es',
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

app.listen(configs.HTTP_PORT, () =>
  console.log(`Listen on port ${configs.HTTP_PORT}`)
);

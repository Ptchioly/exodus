import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { configs } from './config';
import { login } from './routes/auth/login';
import { logout } from './routes/auth/logout';
import { signup } from './routes/auth/signup';
import { authentication } from './routes/auth/validate';
import { hook } from './routes/monobank/hook';
import { limit } from './routes/monobank/limits';
import { personalInfo } from './routes/monobank/personal';
import { statement } from './routes/monobank/statement';
import { deleteUser } from './routes/settings/deleteUser';
import { updateInfo } from './routes/settings/updateInfo';
import { initTelegramBot } from './routes/telegram/initTelegram';
import { telegramBot } from './routes/telegram/webHook';
import { logging } from './utils';

export const app = express();

const defaultRoute = (req: Request, res: Response): void => {
  res
    .status(200)
    .send(
      `<div style="margin-top: 120px; width: 100%; text-align: center; font-size: 10em; display: block;">🐝 🐝 🐝 🐝 🐝</div>`
    );
};

app.use(
  cors({
    origin: [
      'http://localhost:5000',
      'http://beeeee.es',
      'https://beeeee.es',
      'http://www.beeeee.es',
      'https://www.beeeee.es',
      'https://staging.beeeee.es',
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

initTelegramBot();

app.use(logging);
app.use(login);
app.use(signup);
app.use(logout);
app.use(statement);
app.use(limit);
app.use(personalInfo);
app.use(authentication);
app.use(updateInfo);
app.use(deleteUser);
app.use(telegramBot);
app.use(hook);
app.get('/', defaultRoute);

app.listen(configs.HTTP_PORT, () => `Listen on port ${configs.HTTP_PORT}`);

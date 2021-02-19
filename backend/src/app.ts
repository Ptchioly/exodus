import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { configs } from './config';
import { login } from './routes/auth/login';
import { logout } from './routes/auth/logout';
import { signup } from './routes/auth/signup';
import { authentication } from './routes/auth/validate';
import { hook } from './routes/monobank/hook';
import { limit } from './routes/monobank/limits';
import { statement } from './routes/monobank/statement';
import { deleteUser } from './routes/settings/deleteUser';
import { updateInfo } from './routes/settings/updateInfo';
import { initTelegramBot } from './routes/telegram/initTelegram';
import { telegramBot } from './routes/telegram/webHook';
import { defaultRoute, logging } from './utils';
initTelegramBot();

export const app = express();

app.use(
  cors({
    origin: configs.ORIGINS,
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
app.use(limit);
app.use(authentication);
app.use(updateInfo);
app.use(deleteUser);
app.use(telegramBot);
app.use(hook);
app.get('/', defaultRoute);

app.listen(configs.HTTP_PORT, () =>
  console.log(`Listen on port ${configs.HTTP_PORT}`)
);

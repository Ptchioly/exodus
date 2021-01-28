import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { statement } from './routes/monobank/statement';
import { auth } from './routes/auth/mobileAuth';

const logging = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(req.url);
  next();
};

export const app = express();
const PORT = 80;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logging);
app.use(statement);
app.use(auth);
app.get('/', (req, res) => res.send('CHOKAVO'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

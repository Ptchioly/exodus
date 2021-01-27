import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Kekw?'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
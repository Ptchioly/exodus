import fetch from 'node-fetch';
import { Router } from 'express';
import { endpoint } from './apis';

export const statement = Router();

statement.get('/statement/:account/:from/:to', async (req, res) => {
  const { account, from, to } = req.params;
  const token: string = req.headers['X-token'] as string;
  const data = await fetch(
    endpoint(`personal/statement/${account}/${from}/${to}`),
    {
      method: 'GET',
      headers: {
        'X-Token': token ?? '',
      },
    }
  );
  res.send(await data.json());
});

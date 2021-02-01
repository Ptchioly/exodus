import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { endpoint } from './endpoints';

export const statement = Router();

statement.get(
  '/statement/:account/:from/:to',
  authenticateToken,
  async (req: any, res) => {
    const { account, from, to } = req.params; // check exist
    const userFromDB = await getItem(configs.USER_TABLE, {
      username: req.user.data,
    });
    if (!isFailure(userFromDB)) {
      const data = await fetch(
        endpoint(`personal/statement/${account}/${from}/${to}`),
        {
          headers: {
            'X-Token': userFromDB.Item.xtoken,
          },
        }
      );
      res.send(await data.json());
    } else res.status(400).json('param pam pam').end();
  }
);

import fetch from 'node-fetch';
import { Router } from 'express';
import { endpoint } from './apis';
import { getItem } from '../dynamo/api';
import { configs } from '../../config';
import { isFailure } from '../types/guards';
import { authenticateToken } from '../auth/validate';

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

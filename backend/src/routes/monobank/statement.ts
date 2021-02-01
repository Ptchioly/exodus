import fetch from 'node-fetch';
import { Router } from 'express';
import { endpoint } from './apis';
import { getItem } from '../dynamo/api';
import { configs } from '../../config';
import { isFailure } from '../types/guards';
import { authenticateToken } from '../auth/validate';

export const statement = Router();

statement.get(
  '/statement/:userId/:account/:from/:to',
  authenticateToken,
  async (req, res) => {
    const { userId, account, from, to } = req.params; // check exist
    console.log('here?');
    const userFromDB = await getItem(configs.USER_TABLE, {
      id: userId,
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
    }
  }
);

import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { requests } from './endpoints';

export const statement = Router();

statement.get('/personal', authenticateToken, async (req: any, res) => {
  const userFromDB = await getItem(configs.USER_TABLE, {
    username: req.user.data,
  });
  const respond = endpointRespond(res);
  if (!isFailure(userFromDB)) {
    const data = await fetch(requests.personal(), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    return respond.SuccessResponse(data);
  } else return respond.FailureResponse('Failed to get user info.');
});

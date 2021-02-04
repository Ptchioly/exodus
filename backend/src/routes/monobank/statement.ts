import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { requests } from './endpoints';
import { categorize } from './paymentsProcessing';
import { requiredFields } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);

  if (req.body) return respond.FailureResponse('Empty body.');

  const { account, from, to } = requiredFields(req.body);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username: req.user.data,
  });
  if (!isFailure(userFromDB)) {
    const data = await fetch(requests.statement(account, from, to), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    return respond.SuccessResponse(categorize(data));
  }
  return respond.FailureResponse('Failed to get statement');
});

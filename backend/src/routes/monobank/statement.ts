import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { requests } from './endpoints';
import { categorize } from './paymentsProcessing';
import { requiredFields } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const username = req.user.data;
  const respond = endpointRespond(res);

  const { account, from, to } = requiredFields(req.body);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB)) {
    const data = await fetch(requests.statement(account, from, to), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    const dataToUI = categorize(data);
    // update new db with statements with data from mono
    updateItem(configs.STATEMENTS_TABLE, { username }, {});
    return respond.SuccessResponse(dataToUI);
  }
  return respond.FailureResponse('Failed to get statement');
});

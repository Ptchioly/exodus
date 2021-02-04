import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { StatementRequest } from '../types/types';
import { requests } from './endpoints';

export const statement = Router();

const requiredFields = ({
  account,
  from,
  to,
}: Partial<StatementRequest>): StatementRequest => {
  const date = Date.now();
  return {
    account: account || 0,
    from: from || date - 2678400000,
    to: to || date,
  };
};

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);
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
    return respond.SuccessResponse(data);
  }
  return respond.FailureResponse('Failed to get statement');
});

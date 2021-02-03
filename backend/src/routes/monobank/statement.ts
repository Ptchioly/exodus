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

const checkStatementParams = ({
  account,
  from,
  to,
}: Partial<StatementRequest>): StatementRequest => {
  return {
    account: account || 0,
    from: from || Date.now() - 2678400000,
    to,
  };
};

statement.get(
  '/statement/:account/:from/:to',
  authenticateToken,
  async (req: any, res) => {
    const { account, from, to } = checkStatementParams(req.params); // check exist
    const userFromDB = await getItem(configs.USER_TABLE, {
      username: req.user.data,
    });
    const respond = endpointRespond(res);
    if (!isFailure(userFromDB)) {
      const data = await fetch(requests.statement(account, from, to), {
        headers: {
          'X-Token': userFromDB.Item.xtoken,
        },
      }).then((el) => el.json());
      return respond.SuccessResponse(data);
    } else return respond.FailureResponse('Failed to get statement');
  }
);

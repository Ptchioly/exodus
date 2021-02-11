import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { updateLimit } from './utils';

export const statement = Router();

statement.post('/limit', authenticateToken, async (req: any, res) => {
  const username = req.user.data;

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });
  const respond = endpointRespond(res);

  const { id, value = 0 } = req.body;
  if (id === undefined)
    return respond.FailureResponse('Failed to get statement');

  if (!isFailure(userFromDB)) {
    const accountId = userFromDB.Item.accounts[0] as any;
    updateLimit(accountId, new Date(Date.now()).valueOf(), id, value);
    return respond.SuccessResponse('Limit was set');
  }
  return respond.FailureResponse('Failed to get statement');
});

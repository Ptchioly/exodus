import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure } from '../types/guards';
import { requiredFields } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const fields = requiredFields(req.body);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  console.log('statement.post => userFromDB', userFromDB);
  if (!isFailure(userFromDB)) {
    const statement = await getItem(configs.STATEMENTS_TABLE, {
      accountId: userFromDB.Item.accounts[0],
    });
    if (isFailure(statement)) return respond.FailureResponse(statement.message);
    if (
      hasKey(statement.Item, fields.from) &&
      statement.Item[fields.from].processedData
    )
      return respond.SuccessResponse(statement.Item[fields.from].processedData);

    return respond.FailureResponse(
      'Data is not available. Wait for a 60s.',
      404
    );
  }
  return respond.FailureResponse('Failed to get statement');
});

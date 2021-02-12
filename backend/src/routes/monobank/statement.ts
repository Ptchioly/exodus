import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure, isValidMounthVariant } from '../types/guards';
import { statementStartDate } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const { mounth } = req.body;
  if (!isValidMounthVariant(mounth))
    return respond.FailureResponse('Invalid mounth variant');

  const from = statementStartDate(mounth).getTime();

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB)) {
    if (!userFromDB.Item)
      return respond.FailureResponse('User from DB is empty');

    const statement = await getItem(configs.STATEMENTS_TABLE, {
      accountId: userFromDB.Item.accounts[0],
    });
    if (isFailure(statement)) return respond.FailureResponse(statement.message);

    if (!statement.Item) return respond.FailureResponse('Statement is empty');

    if (hasKey(statement.Item, from) && statement.Item[from].processedData)
      return respond.SuccessResponse(statement.Item[from].processedData);

    return respond.FailureResponse(
      'Data is not available. Wait for a 60s.',
      404
    );
  }
  return respond.FailureResponse(
    'Failed to get statement. ' + userFromDB.message
  );
});

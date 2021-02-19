import { Router } from 'express';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure } from '../types/guards';
import { Tables } from '../types/types';
import mergeStatements from './mergeStatements';
import { startMonth } from './utils';

export const statement = Router();

statement.get('/statement', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const current = startMonth('cur');
  const previous = startMonth('prev');

  const userFromDB = await getItem(Tables.USERS, {
    username,
  });

  if (!isFailure(userFromDB)) {
    if (!userFromDB.Item)
      return respond.FailureResponse('User from DB is empty');

    const statement = await getItem(Tables.STATEMENTS, {
      accountId: userFromDB.Item.accounts[0],
    });

    if (isFailure(statement)) return respond.FailureResponse(statement.message);
    if (!statement.Item) return respond.FailureResponse('Statement is empty');

    if (
      hasKey(statement.Item, current) &&
      hasKey(statement.Item[current], 'processedData')
    ) {
      const currentStatement = statement.Item[current].processedData;
      const previousStatement = statement.Item[previous]?.processedData;
      const merged = mergeStatements(currentStatement, previousStatement);

      return respond.SuccessResponse({
        statements: merged,
        synced: !!previousStatement,
      });
    }

    return respond.FailureResponse('Not Found', 404);
  }
  return respond.FailureResponse(
    'Failed to get statement. ' + userFromDB.message
  );
});

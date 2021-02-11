import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { hasKey, isFailure } from '../types/guards';
import { getStatements } from './endpoints';
import { categorize } from './paymentsProcessing';
import { requiredFields } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const { username, xtoken } = req.user.data;
  const respond = endpointRespond(res);

  const fields = requiredFields(req.body);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB)) {
    const statement = await getItem(configs.STATEMENTS_TABLE, {
      accountId: userFromDB.Item.accounts[0],
    });
    if (isFailure(statement)) return respond.FailureResponse(statement.message);
    if (
      !isFailure(statement) &&
      hasKey(statement.Item, fields.from) &&
      statement.Item[fields.from].processedData
    ) {
      console.log('JUST STATEMENT');
      return respond.SuccessResponse(statement.Item[fields.from].processedData);
    }

    console.log('NOTJING STATEMENT');
    return respond.FailureResponse(
      'Data is not available. Wait for a 60s.',
      404
    );
  }
  return respond.FailureResponse('Failed to get statement');
});

import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { getStatements } from './endpoints';
import { categorize } from './paymentsProcessing';
import { requiredFields, statementUpdate } from './utils';

export const statement = Router();

statement.post('/statement', authenticateToken, async (req: any, res) => {
  const { username, xtoken } = req.user.data;
  const respond = endpointRespond(res);

  const fields = requiredFields(req.body);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB)) {
    const data = await getStatements(fields, xtoken);
    const dataToUI = categorize(data);
    statementUpdate(userFromDB, fields.from, data, dataToUI);
    return respond.SuccessResponse(dataToUI);
  }
  return respond.FailureResponse('Failed to get statement');
});

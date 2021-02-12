import { Router } from 'express';
import { appendStatement, incrementStatemntSpendings } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { isFailure } from '../types/guards';
import { MonoStatement } from '../types/types';
import { getMccCategory } from './paymentsProcessing';

export const hook = Router();

type StatementItems = {
  type: 'StatementItem';
  data: {
    account: string;
    statementItem: MonoStatement;
  };
};

hook.post('/hook', async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.'); // dunno if it's necessary

  const { account, statementItem } = (req.body as StatementItems).data;

  const { id } = getMccCategory(statementItem.mcc);

  const updateUserRawStatement = await appendStatement(
    'statements',
    {
      accountId: account,
    },
    statementItem,
    'rawData'
  );

  if (isFailure(updateUserRawStatement)) {
    return respond.FailureResponse('Failed to update user raw statement');
  }

  const inctementResponse = incrementStatemntSpendings(
    'statements',
    {
      accountId: account,
    },
    Math.abs(statementItem.amount) / 100,
    id
  );

  if (isFailure(inctementResponse)) {
    return respond.FailureResponse('Failed to increment proccess');
  }

  return respond.SuccessResponse(updateUserRawStatement);
});

import { Router } from 'express';
import { configs } from '../../config';
import { getProcessedData, putItem, updateStatements } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { isFailure } from '../types/guards';
import { categorize } from './paymentsProcessing';

export const hook = Router();

/*
{
  "type": "StatementItem",
  "data": {
    "account": "IJrjIORn-I7_hZQMF6FLxQ",
    "statementItem": {
      "id": "dYKjDzwveeLW7r66",
      "time": 1612536643,
      "description": "От: Гліб Т.",
      "mcc": 4829,
      "amount": 10000,
      "operationAmount": 10000,
      "currencyCode": 980,
      "commissionRate": 0,
      "cashbackAmount": 0,
      "balance": 834457,
      "hold": true
    }
  }
}
*/

type StatementItems = {
  type: 'StatementItem';
  data: {
    account: string;
    statementItem: MonoStatementItem[];
  };
};

type MonoStatementItem = {
  id: string;
  time: number;
  description: string;
  mcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment: string;
  receiptId: string;
  counterEdrpou: string;
  counterIban: string;
};

hook.post('/monobank/webhook', async (req: any, res) => {
  const respond = endpointRespond(res);

  const { account, statementItem } = req.body.data;

  const updateUserResponse = await updateStatements(account, statementItem);

  const [category] = categorize([statementItem]);

  const dbCategory = await getProcessedData(account, category.id);
  if (!isFailure(updateUserResponse) && !isFailure(dbCategory))
    // searching by account and push statementItem to others

    return respond.SuccessResponse({});
});

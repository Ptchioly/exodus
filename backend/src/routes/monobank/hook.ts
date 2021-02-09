import { Router } from 'express';
import { putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';

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

hook.get('/hook', async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.'); // dunno if it's necessary

  const { account, statementItem } = (req.body as StatementItems).data;

  const updateUserResponse = await putItem('statements', {
    account,
    statementItem,
  });

  // searching by account and push statementItem to others

  return respond.SuccessResponse({});
});

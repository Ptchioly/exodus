import { Router } from 'express';
import {
  appendStatement,
  getItem,
  incrementStatementSpendings,
  moneySpentToLimit,
} from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { sendTelegramMessage } from '../telegram/sendMessage';
import { isFailure } from '../types/guards';
import { MonoStatement, Tables } from '../types/types';
import { getMccCategory } from './paymentsProcessing';

export const hook = Router();

type StatementItems = {
  type: 'StatementItem';
  data: {
    account: string;
    statementItem: MonoStatement;
  };
};

const pushNotificationIfLimitReached = async (
  accountId: string,
  categoryId: number,
  categoryTitle: string
): Promise<void> => {
  const limits = await moneySpentToLimit({ accountId }, categoryId);

  if (!isFailure(limits)) {
    const { limit, moneySpent, username } = limits;
    const limitReached = limit && limit <= moneySpent;
    const userFromDB = await getItem(Tables.USERS, {
      username,
    });
    if (!isFailure(userFromDB)) {
      const { telegramId } = userFromDB.Item;
      if (telegramId && limitReached) {
        await sendTelegramMessage(telegramId)(
          `You have exceeded the limit ${limit} for category ${categoryTitle}`
        );
      }
    }
  }
};

hook.post('/hook', async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) {
    return respond.FailureResponse('Empty body.');
  }

  const { account, statementItem } = (req.body as StatementItems).data;

  const { id, category } = getMccCategory(statementItem.mcc);

  const updateUserRawStatement = await appendStatement(
    {
      accountId: account,
    },
    statementItem,
    'rawData'
  );

  if (isFailure(updateUserRawStatement)) {
    console.log('Failed to update user raw statement', updateUserRawStatement);
    return respond.SuccessResponse();
  }

  const incrementResponse = await incrementStatementSpendings(
    {
      accountId: account,
    },
    Math.abs(statementItem.amount) / 100,
    id
  );

  if (isFailure(incrementResponse)) {
    console.log('Failed to increment proccess', incrementResponse);
    return respond.SuccessResponse();
  }

  pushNotificationIfLimitReached(account, id, category);

  return respond.SuccessResponse(updateUserRawStatement);
});

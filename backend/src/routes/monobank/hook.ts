import { Router } from 'express';
import { configs } from '../../config';
import {
  appendStatement,
  getItem,
  incrementStatementSpendings,
  moneySpetToLimit,
} from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { sendTelegramMessage } from '../telegram/sendMessage';
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

const pushNotificationIfLimitReached = async (
  accountId: string,
  categoryId: number,
  categoryTitle: string
): Promise<void> => {
  const limits = await moneySpetToLimit(
    configs.STATEMENTS_TABLE,
    { accountId },
    categoryId
  );

  if (!isFailure(limits)) {
    const { limit, moneySpent, username } = limits;
    const limitReached = limit && limit <= moneySpent;
    const userFromDB = await getItem(configs.USER_TABLE, {
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
    console.log('LOGGGGGGGING EMPTY BODY LOL');
    return respond.FailureResponse('Empty body.');
  } // dunno if it's necessary

  const { account, statementItem } = (req.body as StatementItems).data;

  const { id, category } = getMccCategory(statementItem.mcc);

  const updateUserRawStatement = await appendStatement(
    configs.STATEMENTS_TABLE,
    {
      accountId: account,
    },
    statementItem,
    'rawData'
  );

  if (isFailure(updateUserRawStatement)) {
    console.log('LOGGGGGGGGGGING RAW UPDATE LOL', updateUserRawStatement);
    return respond.FailureResponse('Failed to update user raw statement');
  }

  const inctementResponse = await incrementStatementSpendings(
    configs.STATEMENTS_TABLE,
    {
      accountId: account,
    },
    Math.abs(statementItem.amount) / 100,
    id
  );

  if (isFailure(inctementResponse)) {
    console.log('LOGGGING INCREMENT LOL', inctementResponse);
    return respond.FailureResponse('Failed to increment proccess');
  }

  pushNotificationIfLimitReached(account, id, category);

  return respond.SuccessResponse(updateUserRawStatement);
});

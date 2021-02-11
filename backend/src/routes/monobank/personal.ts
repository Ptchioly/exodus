import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { MonoAccount } from '../types/types';
import { requests } from './endpoints';

export const personalInfo = Router();

const getAccounts = (accounts: MonoAccount[]): string[] =>
  accounts.filter((acc) => acc.balance !== 0).map((acc) => acc.id);

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const { username, xtoken } = req.user.data;
  const respond = endpointRespond(res);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB) && userFromDB.Item) {
    const { name, webHookUrl, accounts } = await fetch(requests.personal(), {
      headers: {
        'X-Token': xtoken,
      },
    }).then((el) => el.json());
    const accountIds = getAccounts(accounts);
    const info = await updateItem(
      configs.USER_TABLE,
      {
        username,
      },
      { name, webHookUrl, accounts: accountIds }
    );
    if (isFailure(info))
      return respond.FailureResponse('Failed to update user info');

    return respond.SuccessResponse({ name, webHookUrl, accounts });
  } else return respond.FailureResponse('Failed to get user info.');
});

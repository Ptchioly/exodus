import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { setHook } from '../auth/utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { getClientInfo } from './endpoints';
import { syncStatements } from './utils';

export const personalInfo = Router();

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const { username, xtoken } = req.user.data;
  const respond = endpointRespond(res);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB) && userFromDB.Item) {
    const clientInfo = await getClientInfo(xtoken);
    if (
      clientInfo.webHookUrl === undefined ||
      clientInfo.webHookUrl.length < 1 ||
      clientInfo.webhook !== ''
    ) {
      setHook(xtoken);
      await syncStatements(userFromDB);
    }
    const { name, accounts } = userFromDB.Item;
    return respond.SuccessResponse({ name, accounts });
  } else return respond.FailureResponse('Failed to get user info.');
});

import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { requests } from './endpoints';

export const personalInfo = Router();

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const username = req.user.data;
  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });
  const respond = endpointRespond(res);
  if (!isFailure(userFromDB)) {
    const { name, webHookUrl, accounts } = await fetch(requests.personal(), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    const info = await updateItem(
      configs.USER_TABLE,
      {
        username,
      },
      { name, webHookUrl, accounts }
    );
    if (isFailure(info))
      return respond.FailureResponse('Failed to update user info');

    return respond.SuccessResponse({ name, webHookUrl, accounts });
  } else return respond.FailureResponse('Failed to get user info.');
});

import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem, updateUser } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { ClientInfo, MonoClientInfo } from '../types/types';
import { requests } from './endpoints';

export const personalInfo = Router();

const updatePersonalInfo = async (
  user: string,
  { name, webHookUrl, accounts }: MonoClientInfo
): Promise<ClientInfo> => {
  // TODO: update all fields
  await updateUser(user, name);
  return {
    name,
    webHookUrl,
    accounts,
  };
};

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const username = req.user.data;
  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });
  const respond = endpointRespond(res);
  if (!isFailure(userFromDB)) {
    const data = await fetch(requests.personal(), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    const info = updatePersonalInfo(username, data);

    return respond.SuccessResponse(info);
  } else return respond.FailureResponse('Failed to get user info.');
});

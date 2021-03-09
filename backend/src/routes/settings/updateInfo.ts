import { Router } from 'express';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { hash } from '../auth/utils';
import { authenticateToken, isValidPassword } from '../auth/validate';
import { getClientInfo } from '../monobank/endpoints';
import { atLeast, isFailedFetchMono, isFailure } from '../types/guards';
import { Tables } from '../types/types';
import { updateUserInfo } from './settingUtils';

export const updateInfo = Router();

updateInfo.post('/updateInfo', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const { oldPassword, newPassword, newXtoken, telegramId } = req.body;

  if (!atLeast(newPassword, newXtoken, telegramId))
    return respond.FailureResponse('Required at least one field');

  const userFromDB = await getItem(Tables.USERS, {
    username,
  });

  if (isFailure(userFromDB))
    return respond.FailureResponse('Failed to get user from database');

  const {
    Item: { key, password },
  } = userFromDB;
  const updateUser = updateUserInfo(username, respond);
  if (newPassword !== undefined) {
    if (!isValidPassword(newPassword))
      return respond.FailureResponse(
        'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
      );

    if (hash(oldPassword, key) !== password)
      return respond.FailureResponse('Old password is incorrect');

    const encryptedPass = hash(newPassword, key);

    return await updateUser({ password: encryptedPass });
  } else if (newXtoken !== undefined) {
    const tokenCheck = await getClientInfo(newXtoken);

    return !isFailure(tokenCheck) && !isFailedFetchMono(tokenCheck)
      ? await updateUser({ xtoken: newXtoken })
      : respond.FailureResponse('X-Token is not valid');
  }
  // should users be able possibility to change his telergamID?
});

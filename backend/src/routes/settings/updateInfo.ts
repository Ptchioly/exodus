import { Router } from 'express';
import { configs } from '../../config';
import { getItem, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { encrypt } from '../auth/utils';
import { authenticateToken } from '../auth/validate';
import { atLeast, isFailure } from '../types/guards';

export const updateInfo = Router();

updateInfo.post('/updateInfo', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const { newPassword, newMonoToken, newTelegramId } = req.body;

  if (!atLeast(newPassword, newMonoToken, newTelegramId))
    return respond.FailureResponse('Required at least one field');

  const userFromDB = await getItem(configs.USER_TABLE, {
    username: req.user.data,
  });

  if (isFailure(userFromDB)) {
    return respond.FailureResponse('Failed to update personal info');
  }

  const { id, key, username, password, xtoken, telegramId } = userFromDB.Item;

  const updateUserResponse = await putItem(configs.USER_TABLE, {
    id,
    key,
    username,
    password: newPassword === undefined ? password : encrypt(password, key),
    xtoken: newMonoToken === undefined ? xtoken : newMonoToken,
    telegramId: newTelegramId === undefined ? telegramId : newTelegramId,
  });

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Failed to update user info');

  return respond.SuccessResponse({});
});

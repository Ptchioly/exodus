import { Router } from 'express';
import { configs } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { encrypt } from '../auth/utils';
import { authenticateToken } from '../auth/validate';
import { atLeast, isFailure } from '../types/guards';

export const updateInfo = Router();

updateInfo.post('/updateInfo', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const { password, xtoken, telegramId } = req.body;

  if (!atLeast(password, xtoken, telegramId))
    return respond.FailureResponse('Required at least one field');

  let encryptedPass = password;

  if (password !== undefined) {
    const userFromDB = await getItem(configs.USER_TABLE, {
      username: req.user.data,
    });

    if (isFailure(userFromDB))
      return respond.FailureResponse('Failed to update user info');

    encryptedPass = encrypt(password, userFromDB.Item.key);
  }

  const updateUserResponse = await updateItem(
    configs.USER_TABLE,
    {
      username: req.user.data,
    },
    { ...req.body, password: encryptedPass }
  );

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Failed to update user info');

  return respond.SuccessResponse({});
});

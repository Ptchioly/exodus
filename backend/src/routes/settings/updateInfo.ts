import { Router } from 'express';
import { configs } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { decrypt, encrypt } from '../auth/utils';
import { authenticateToken, validateUserInfo } from '../auth/validate';
import { atLeast, isFailure } from '../types/guards';

export const updateInfo = Router();

updateInfo.post('/updateInfo', authenticateToken, async (req: any, res) => {
  const { username, xtoken } = req.user.data;
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const { oldPassword, newPassword, newXtoken, telegramId } = req.body;
  const { message } = await validateUserInfo({
    username,
    password: newPassword,
    xtoken,
  });

  if (message !== 'OK') return respond.FailureResponse(message);

  if (!atLeast(newPassword, newXtoken, telegramId))
    return respond.FailureResponse('Required at least one field');

  let encryptedPass = newPassword;

  if (newPassword !== undefined) {
    const userFromDB = await getItem(configs.USER_TABLE, {
      username,
    });
    if (!isFailure(userFromDB)) {
      const user = userFromDB.Item;
      const decryptedCurrent = decrypt(user.password, user.key);

      if (decryptedCurrent !== oldPassword)
        return respond.FailureResponse('Old password is incorrect');

      encryptedPass = encrypt(newPassword, userFromDB.Item.key);

      const updateUserResponse = await updateItem(
        configs.USER_TABLE,
        { username },
        { ...req.body, password: encryptedPass }
      );
      if (isFailure(updateUserResponse))
        return respond.FailureResponse('Failed to update user info');
      return respond.SuccessResponse();
    }
    return respond.FailureResponse('Failed to get user from database');
  }
});

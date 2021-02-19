import { Router } from 'express';
import { getItem, updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { hash, isValidPassword } from '../auth/utils';
import { authenticateToken } from '../auth/validate';
import { getClientInfo } from '../monobank/endpoints';
import { atLeast, isFailedFetchMono, isFailure } from '../types/guards';
import { Tables } from '../types/types';

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
  if (!isFailure(userFromDB)) {
    const user = userFromDB.Item;
    if (newPassword !== undefined) {
      if (!isValidPassword(newPassword))
        return respond.FailureResponse(
          'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
        );

      const oldHash = hash(oldPassword, user.key);
      if (oldHash !== user.password)
        return respond.FailureResponse('Old password is incorrect');

      const encryptedPass = hash(newPassword, userFromDB.Item.key);

      const updateUserResponse = await updateItem(
        Tables.USERS,
        { username },
        { password: encryptedPass }
      );
      if (isFailure(updateUserResponse))
        return respond.FailureResponse('Failed to update user info');
      return respond.SuccessResponse();
    } else if (newXtoken !== undefined) {
      const tokenCheck = await getClientInfo(newXtoken);
      if (!isFailure(tokenCheck) && !isFailedFetchMono(tokenCheck)) {
        const updateUserResponse = await updateItem(
          Tables.USERS,
          { username },
          { xtoken: newXtoken }
        );
        if (isFailure(updateUserResponse))
          return respond.FailureResponse('Failed to update user info');
        return respond.SuccessResponse();
      }
      return respond.FailureResponse('X-Token is not valid');
    }
  }
  return respond.FailureResponse('Failed to get user from database');
});

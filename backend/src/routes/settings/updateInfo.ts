import { Router } from 'express';
import { configs } from '../../config';
import { updateItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { atLeast, isFailure } from '../types/guards';

export const updateInfo = Router();

updateInfo.post('/updateInfo', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const { password, xtoken, telegramId } = req.body;

  if (!atLeast(password, xtoken, telegramId))
    return respond.FailureResponse('Required at least one field');

  const updateUserResponse = await updateItem(
    configs.USER_TABLE,
    {
      username: req.user.data,
    },
    req.body
  );

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Failed to update user info');

  return respond.SuccessResponse({});
});

import { Router } from 'express';
import { configs } from '../../config';
import { deleteItem, getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';

export const deleteUser = Router();

deleteUser.delete('/deleteUser', authenticateToken, async (req: any, res) => {
  const respond = endpointRespond(res);

  if (!req.body) return respond.FailureResponse('Empty body.');

  const userFromDB = await getItem(configs.USER_TABLE, {
    username: req.user.data,
  });

  if (isFailure(userFromDB)) {
    return respond.FailureResponse('Failed to delete user');
  }

  const updateResponse = await deleteItem(configs.USER_TABLE, {
    username: req.user.data,
  });

  if (isFailure(updateResponse)) {
    return respond.FailureResponse('Failed to delete user');
  }

  return respond.SuccessResponse({});
});

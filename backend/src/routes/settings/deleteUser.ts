import { Router } from 'express';
import { configs } from '../../config';
import { deleteItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';

export const deleteUser = Router();

deleteUser.delete('/deleteUser', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const updateResponse = await deleteItem(configs.USER_TABLE, {
    username,
  });

  if (isFailure(updateResponse)) {
    return respond.FailureResponse('Failed to delete user');
  }
  res.clearCookie('jwt');
  return respond.SuccessResponse();
});

import { Router } from 'express';
import { deleteItem, getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { Tables } from '../types/types';
import { deleteAccounts } from './settingUtils';

export const deleteUser = Router();

deleteUser.delete('/deleteUser', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const userResponse = await getItem(Tables.USERS, { username });

  const updateResponse = await deleteItem(Tables.USERS, { username });

  if (!isFailure(updateResponse) && !isFailure(userResponse) && userResponse) {
    const isDeleted = await deleteAccounts(
      Tables.STATEMENTS,
      userResponse.Item.accounts.map((a) => a.id)
    );
    if (isDeleted) {
      res.clearCookie('jwt');
      return respond.SuccessResponse();
    }
  }
  return respond.FailureResponse('Failed to delete user');
});

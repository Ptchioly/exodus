import { Router } from 'express';
import { configs } from '../../config';
import { deleteAccounts, deleteItem, getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';

export const deleteUser = Router();

deleteUser.delete('/deleteUser', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const userResponse = await getItem(configs.USER_TABLE, { username });

  const updateResponse = await deleteItem(configs.USER_TABLE, { username });

  if (!isFailure(updateResponse) && !isFailure(userResponse) && userResponse) {
    const isDeleted = await deleteAccounts(
      configs.STATEMENTS_TABLE,
      userResponse.Item.accounts
    );
    if (isDeleted) {
      res.clearCookie('jwt');
      return respond.SuccessResponse();
    }
  }
  return respond.FailureResponse('Failed to delete user');
});

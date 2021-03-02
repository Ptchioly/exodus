import { Router } from 'express';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { Tables } from '../types/types';
import { updateLimit } from './utils';

export const limit = Router().post(
  '/limit/:accountId',
  authenticateToken,
  async (req: any, res) => {
    const { username } = req.user.data;
    const { accountId } = req.params;
    const respond = endpointRespond(res);

    const userFromDB = await getItem(Tables.USERS, { username });

    const { categoryId, value } = req.body;

    if (!isFailure(userFromDB)) {
      await updateLimit(accountId, categoryId, value);

      return respond.SuccessResponse({ newLimit: value, categoryId });
    }
    return respond.FailureResponse('Failed to get user from db');
  }
);

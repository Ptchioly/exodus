import { Router } from 'express';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { Tables } from '../types/types';
import { updateLimit } from './utils';

export const limit = Router().post(
  '/limit',
  authenticateToken,
  async (req: any, res) => {
    const { username } = req.user.data;
    const respond = endpointRespond(res);

    const userFromDB = await getItem(Tables.USERS, { username });

    const { category, value } = req.body;

    if (!isFailure(userFromDB)) {
      const accountId = userFromDB.Item.accounts[0];
      await updateLimit(accountId, category, value);

      return respond.SuccessResponse({ newLimit: value, category });
    }
    return respond.FailureResponse('Failed to get user from db');
  }
);

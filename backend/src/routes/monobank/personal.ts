import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';

export const personalInfo = Router();

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const { username } = req.user.data;
  const respond = endpointRespond(res);

  const userFromDB = await getItem(configs.USER_TABLE, {
    username,
  });

  if (!isFailure(userFromDB) && userFromDB.Item) {
    const { name, accounts } = userFromDB.Item;
    return respond.SuccessResponse({ name, accounts });
  } else return respond.FailureResponse('Failed to get user info.');
});

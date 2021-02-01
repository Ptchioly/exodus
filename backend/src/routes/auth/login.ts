import { Router } from 'express';
import { configs } from '../../config';
import { endpointRespond } from '../../utils';
import { getItem } from '../dynamo/api';
import { Users } from '../types/types';
import { exist, isFailure } from '../types/guards';
import { decrypt } from './utils';
import { generateAccessToken } from './validate';

export const login = Router();

login.post('/login', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password } = req.body;

  if (!exist(req.body, username, password))
    return respond.FailureResponse('Required fields are empty');

  const userResponse = await getItem(configs.USER_TABLE, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse('Unable to get user');

  const user: Users = userResponse.Item;

  if (!user) return respond.FailureResponse('Unauthorized user.');

  const decrypted = decrypt(user.password!, user.key!);

  if (password !== decrypted)
    return respond.FailureResponse('Incorrect password.');

  const token = generateAccessToken(userResponse.Item.username);
  return respond.SuccessResponse({ user_id: userResponse.Item.id, token });
});

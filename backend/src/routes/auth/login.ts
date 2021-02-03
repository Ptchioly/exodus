import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { Users } from '../types/types';
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
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return respond.SuccessResponse({ user_id: userResponse.Item.id });
});

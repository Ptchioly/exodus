import { Router } from 'express';
import { configs } from '../../config';
import { endpointRespond } from '../../utils';
import { getItem, putItem } from '../dynamo/api';
import { exist, isFailure } from '../types/guards';
import { encrypt } from './utils';
import { nanoid } from 'nanoid';
import { generateAccessToken } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse('Required fields are empty');

  const userResponse = await getItem(configs.USER_TABLE, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse('Unable to get user.');

  if (userResponse.Item)
    return respond.FailureResponse('User already exist', 409);

  const id = nanoid(7); // magic id
  const key = nanoid(21); // magic key
  const encryptedPassword = encrypt(password, key);

  const updateUserResponse = await putItem(configs.USER_TABLE, {
    id,
    key,
    username,
    password: encryptedPassword,
    xtoken,
  });

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Unable to create user.');

  const token = generateAccessToken(username);

  return respond.SuccessResponse({ user_id: id, token });
});

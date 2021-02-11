import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { encrypt, getAccounts } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse('Required fields are empty');

  const { message, data } = await validateUserInfo(req.body);

  if (message !== 'OK') return respond.FailureResponse(message);

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
    name: data.name,
    accounts: getAccounts(data.accounts),
  });

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Unable to create user.');

  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  return respond.SuccessResponse({ user_id: id });
});

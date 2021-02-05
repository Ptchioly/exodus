import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { encrypt } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse('Required fields are empty');

  const validationVerdict = validateUserInfo(username, password);

  if (validationVerdict !== 'OK')
    return respond.FailureResponse(validationVerdict);

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
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  return respond.SuccessResponse({ user_id: id });
});

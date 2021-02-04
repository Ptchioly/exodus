import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { encrypt, isValidPassword, isValidUsername } from './utils';
import { generateAccessToken } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse('Required fields are empty');

  if (!isValidUsername(username))
    return respond.FailureResponse('Phone number is not valid.');

  if (!isValidPassword(password))
    return respond.FailureResponse(
      'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
    );
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

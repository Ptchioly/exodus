import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { Tables } from '../types/types';
import { hash } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const login = Router();

login.post('/login', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password } = req.body;

  if (!exist(req.body, username, password))
    return respond.FailureResponse('Required fields are empty.');

  const { message } = await validateUserInfo(req.body);

  if (message !== 'OK') return respond.FailureResponse(message);

  const userResponse = await getItem(Tables.USERS, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse('Unable to get user. Contact support.');

  const user = userResponse.Item;
  if (!user) return respond.FailureResponse('User does not exist.');
  const { xtoken, name } = user;

  const encrypt = hash(password, user.key);

  if (user.password !== encrypt)
    return respond.FailureResponse('Incorrect password.');

  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  return respond.SuccessResponse({ name });
});

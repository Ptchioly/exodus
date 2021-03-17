import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { APIError, Tables } from '../types/types';
import { hash } from './utils';
import {
  generateAccessToken,
  validateUserInfo,
  validateWebhook,
} from './validate';

export const login = Router();

login.post('/login', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password } = req.body;

  if (!exist(req.body, username, password))
    return respond.FailureResponse(APIError.MISSED_REQUIRED_FIELDS); //'Required fields are empty.'

  const { message } = await validateUserInfo(req.body);

  if (message !== APIError.OK) return respond.FailureResponse(message);

  const userResponse = await getItem(Tables.USERS, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse(APIError.UNABLE_GET_USER); //'Unable to get user. Contact support.'

  const user = userResponse.Item;
  if (!user) return respond.FailureResponse(APIError.NO_SUCH_USER); // 'User does not exist.'
  const { xtoken, name } = user;

  const encrypt = hash(password, user.key);

  if (user.password !== encrypt)
    return respond.FailureResponse(APIError.PWD_INCORRCT); //'Incorrect password.'

  validateWebhook(xtoken, name);
  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  return respond.SuccessResponse({ name, accounts: user.accounts });
});

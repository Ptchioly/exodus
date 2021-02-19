import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, getTokens, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { syncStatements } from '../monobank/utils';
import { exist, isFailure } from '../types/guards';
import { ResponseType, Tables } from '../types/types';
import { encrypt, getAccounts, setHook } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse('Required fields are empty');

  const { message, data } = await validateUserInfo(req.body);

  if (message !== 'OK') return respond.FailureResponse(message);

  const { clientId, name, accounts } = data;

  const userResponse = await getItem(Tables.USERS, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse('Unable to get user.');

  if (userResponse.Item) return respond.FailureResponse('User already exist.');

  const tokenResponse = await getTokens(Tables.USERS);

  if (isFailure(tokenResponse) || !tokenResponse.Items)
    return respond.FailureResponse('Unable get tokens');

  if (!tokenResponse.Items)
    return respond.FailureResponse('Unexpected error from db.');

  if (tokenResponse.Items.some((e: any) => e.xtoken === xtoken))
    return respond.FailureResponse('Monobank token is already registered.');

  const key = nanoid(21);
  const encryptedPassword = encrypt(password, key);

  const user = {
    id: clientId,
    key,
    username,
    password: encryptedPassword,
    xtoken,
    name,
    accounts: getAccounts(accounts),
  };

  const updateUserResponse = await putItem(Tables.USERS, user);

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Unable to create user.');

  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  setHook(xtoken);

  await syncStatements({ Item: user });

  return respond.SuccessResponse({ name });
});

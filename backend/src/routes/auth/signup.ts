import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, getTokens, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { syncStatements } from '../monobank/utils';
import { exist, isFailure } from '../types/guards';
import { APIError, Tables } from '../types/types';
import { hash, getAccounts, setHook } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const signup = Router();

signup.post('/signup', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password, xtoken } = req.body;

  if (!exist(req.body, username, password, xtoken))
    return respond.FailureResponse(APIError.MISSED_REQUIRED_FIELDS);

  const { message, data } = await validateUserInfo(req.body);

  if (message !== APIError.OK) return respond.FailureResponse(message);

  const { clientId, name, accounts } = data;

  const userResponse = await getItem(Tables.USERS, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse(APIError.UNABLE_GET_USER);

  if (userResponse.Item)
    return respond.FailureResponse(APIError.USER_ALREADY_EXISTS);

  const tokenResponse = await getTokens(Tables.USERS);

  if (isFailure(tokenResponse))
    return respond.FailureResponse(APIError.UNABLE_GET_TOKEN); //'Unable to get tokens'

  if (!tokenResponse.Items) return respond.FailureResponse(APIError.DB_ERROR); //'Unexpected error from db.'

  if (tokenResponse.Items.some((e: any) => e.xtoken === xtoken))
    return respond.FailureResponse(APIError.TOKEN_ALREADY_REGISTRED); //'Monobank token is already registered.'

  const key = nanoid(21);
  const encryptedPassword = hash(password, key);

  const userAccounts = getAccounts(accounts);
  const user = {
    id: clientId,
    key,
    username,
    password: encryptedPassword,
    xtoken,
    name,
    accounts: userAccounts,
  };

  const updateUserResponse = await putItem(Tables.USERS, user);

  if (isFailure(updateUserResponse))
    return respond.FailureResponse(APIError.UNABLE_CREATE_USER); //'Unable to create user.'

  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  setHook(xtoken);

  await syncStatements(user);

  return respond.SuccessResponse({ name, accounts: userAccounts });
});

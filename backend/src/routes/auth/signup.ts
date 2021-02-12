import { Router } from 'express';
import { nanoid } from 'nanoid';
import { configs } from '../../config';
import { getItem, getTokens, putItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { requests } from '../monobank/endpoints';
import { syncStatements } from '../monobank/utils';
import { exist, isFailure } from '../types/guards';
import { encrypt, getAccounts } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';
import fetch from 'node-fetch';

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

  if (isFailure(userResponse) || userResponse.Item)
    return respond.FailureResponse('User already exist.');

  const tokenResponse = await getTokens(configs.USER_TABLE);
  console.log(tokenResponse);

  if (!tokenResponse.Items)
    return respond.FailureResponse('Unexpected error from db.');

  if (tokenResponse.Items.some((e: any) => e.xtoken === xtoken))
    return respond.FailureResponse('Monobank token is already registered.');

  const key = nanoid(21);
  const encryptedPassword = encrypt(password, key);

  const user = {
    id: data.clientId,
    key,
    username,
    password: encryptedPassword,
    xtoken,
    name: data.name,
    accounts: getAccounts(data.accounts),
  };

  const updateUserResponse = await putItem(configs.USER_TABLE, user);

  if (isFailure(updateUserResponse))
    return respond.FailureResponse('Unable to create user.');

  const token = generateAccessToken(username, xtoken);
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  await fetch(requests.webhook(), {
    method: 'POST',
    headers: {
      'X-Token': xtoken,
    },
    body: JSON.stringify({
      webHookUrl: 'https://api.beeeee.es/hook',
    }),
  })
    .then(console.log)
    .catch(console.log);

  await syncStatements({
    Item: user as any,
  });

  return respond.SuccessResponse();
});

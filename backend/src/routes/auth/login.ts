import { Router } from 'express';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { exist, isFailure } from '../types/guards';
import { decrypt } from './utils';
import { generateAccessToken, validateUserInfo } from './validate';

export const login = Router();

login.post('/login', async (req, res) => {
  const respond = endpointRespond(res);
  const { username, password } = req.body;

  if (!exist(req.body, username, password))
    return respond.FailureResponse('Required fields are empty');

  const { message } = await validateUserInfo(req.body);

  if (message !== 'OK') return respond.FailureResponse(message);

  const userResponse = await getItem(configs.USER_TABLE, {
    username,
  });

  if (isFailure(userResponse))
    return respond.FailureResponse('Unable to get user');

  const user = userResponse.Item;
  if (!user) return respond.FailureResponse('Unauthorized user.');

  const decrypted = decrypt(user.password, user.key);

  if (password !== decrypted)
    return respond.FailureResponse('Incorrect password.');

  const token = generateAccessToken(
    userResponse.Item.username,
    userResponse.Item.xtoken
  );
  res.cookie('jwt', token, { maxAge: configs.MAX_AGE });

  return respond.SuccessResponse({ user_id: userResponse.Item.id });
});

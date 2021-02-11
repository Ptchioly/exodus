import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { secrets } from '../../config';
import { endpointRespond } from '../../utils';
import { getClientInfo, requests } from '../monobank/endpoints';
import { isValidPassword, isValidUsername } from './utils';

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.jwt;
  if (!token)
    return endpointRespond(res).FailureResponse('No token provided.', 401);

  jwt.verify(token, secrets.SESSION_TOKEN as string, (err: any, user: any) => {
    if (err)
      return endpointRespond(res).FailureResponse('Verification error.', 403);
    req.user = user;
    next();
  });
};

export const authentication = Router().get(
  '/authentication',
  authenticateToken,
  (req: any, res) => endpointRespond(res).SuccessResponse({})
);

export const generateAccessToken = (username: string, xtoken: string): string =>
  jwt.sign({ data: { username, xtoken } }, secrets.SESSION_TOKEN as string, {
    expiresIn: '1d',
  });

const isValidToken = async (token: string): Promise<boolean> => {
  const data = await fetch(requests.personal(), {
    headers: {
      'X-Token': token,
    },
  }).then((el) => el.json());
  if (data.errorDescription) return false;
  return data;
};

const formVerdict = (message: string, data?: any) => {
  return { message, data };
};

export const validateUserInfo = async ({
  username,
  password,
  xtoken,
}: any): Promise<any> => {
  if (!isValidUsername(username))
    return formVerdict('Phone number is not valid.');

  if (!isValidPassword(password))
    return formVerdict(
      'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
    );

  if (xtoken) {
    const validateToken = await getClientInfo(xtoken);
    return validateToken.errorDescription
      ? formVerdict("Unknown 'X-Token'")
      : formVerdict('OK', validateToken);
  }
  return formVerdict('OK');
};

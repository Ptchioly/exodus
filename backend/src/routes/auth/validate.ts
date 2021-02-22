import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { secrets } from '../../config';
import { endpointRespond } from '../../utils';
import { getClientInfo } from '../monobank/endpoints';
import { isFailedFetchMono } from '../types/guards';
import { isValidPassword, isValidUsername } from './utils';

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
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
  (req: any, res) => endpointRespond(res).SuccessResponse()
);

export const generateAccessToken = (username: string, xtoken: string): string =>
  jwt.sign({ data: { username, xtoken } }, secrets.SESSION_TOKEN as string, {
    expiresIn: '1d',
  });

const formVerdict = (message: string, data?: any) => ({ message, data });

export const validateUserInfo = async ({
  username,
  password,
  xtoken,
}: any): Promise<{ message: string; data: any }> => {
  if (!isValidUsername(username))
    return formVerdict('Phone number is invalid.');

  if (!isValidPassword(password))
    return formVerdict(
      'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.'
    );

  if (xtoken) {
    const validateToken = await getClientInfo(xtoken);
    return isFailedFetchMono(validateToken)
      ? formVerdict('Invalid X-Token')
      : formVerdict('OK', validateToken);
  }
  return formVerdict('OK');
};

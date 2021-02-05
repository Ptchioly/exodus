import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { secrets } from '../../config';
import { endpointRespond } from '../../utils';
import { isValidUsername, isValidPassword } from './utils';

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
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

export const generateAccessToken = (username: string): string =>
  jwt.sign({ data: username }, secrets.SESSION_TOKEN as string, {
    expiresIn: '1d',
  });

export const authentication = Router().get(
  '/authentication',
  authenticateToken,
  (req: any, res) => endpointRespond(res).SuccessResponse({})
);

export const validateUserInfo = (
  username: string,
  password: string
): string => {
  if (!isValidUsername(username)) return 'Phone number is not valid.';

  if (!isValidPassword(password))
    return 'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters and numbers.';
  return 'OK';
};

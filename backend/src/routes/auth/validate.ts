import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { secrets } from '../../config';
import { endpointRespond } from '../../utils';

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null)
    return endpointRespond(res).FailureResponse('No token provided.', 401);

  jwt.verify(token, secrets.SESSION_TOKEN as string, (err: any, user: any) => {
    if (err)
      return endpointRespond(res).FailureResponse('Verification error.', 403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

export const generateAccessToken = (username: string): string => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ data: username }, secrets.SESSION_TOKEN as string, {
    expiresIn: '1h',
  });
};

export const authentication = Router();

authentication.get('/auth', authenticateToken, (req, res) => {
  return endpointRespond(res).SuccessResponse({});
});

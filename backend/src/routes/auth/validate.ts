import { NextFunction, Response, Request } from 'express';
// import { endpointRespond } from '../../utils';
// import { isLoggedIn } from './utils';
import jwt from 'jsonwebtoken';
import { secrets } from '../../config';

// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   if (!isLoggedIn(req)) {
//     const respond = endpointRespond(res);
//     console.log(req.session);
//     console.log('Oops');
//     return respond.FailureResponse('You must be logged in');
//   }

//   next();
// };

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, secrets.SESSION_TOKEN as string, (err: any, user: any) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    //   req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

export const generateAccessToken = (username: string): string => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ data: username }, secrets.SESSION_TOKEN as string, {
    expiresIn: '1h',
  });
};

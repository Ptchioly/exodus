import { NextFunction, Response, Request } from 'express';
import { endpointRespond } from '../../utils';
import { isLoggedIn } from './utils';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!isLoggedIn(req)) {
    const respond = endpointRespond(res);
    console.log(req.session);
    console.log('Oops');
    return respond.FailureResponse('You must be logged in');
  }

  next();
};

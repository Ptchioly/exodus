import { NextFunction, Request, Response } from 'express';

export const endpointRespond = (res: Response) => ({
  SuccessResponse: (data: any, status = 200): void => {
    res.status(status).json(data).end();
  },
  FailureResponse: (message = 'Bad request.', status = 400): void => {
    res.status(status).json({ message }).end();
  },
});

export const logging = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(req.url, req.method);
  next();
};

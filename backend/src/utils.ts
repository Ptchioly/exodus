import { AWSError } from 'aws-sdk';
import { NextFunction, Request, Response } from 'express';

export const endpointRespond = (res: Response) => ({
  SuccessResponse: (data = {}, status = 200): void => {
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
  next();
};

export const isInRange = (ranges: number[][], num: number): boolean =>
  ranges.some(([min, max]) => min <= num && num <= max);

export const AWSNotFound = (message: string): AWSError => ({
  name: 'ERRNOTFOUND',
  code: '404',
  message,
  time: new Date(),
});

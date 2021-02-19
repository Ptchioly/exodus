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
  console.log(req.url, req.method);
  next();
};

export const defaultRoute = (req: Request, res: Response): void => {
  res
    .status(200)
    .send(
      `<div style="margin-top: 120px; width: 100%; text-align: center; font-size: 10em; display: block;">🐝 🐝 🐝 🐝 🐝</div>`
    );
};

export const isInRange = (ranges: number[][], num: number): boolean =>
  ranges.some(([min, max]) => min <= num && num <= max);

export const AWSNotFound = (message: string): AWSError => ({
  name: 'ERRNOTFOUND',
  code: '404',
  message,
  time: new Date(),
});

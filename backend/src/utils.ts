import { AWSError } from 'aws-sdk';
import { NextFunction, Request, Response } from 'express';
import { APIError, EndpointRes } from './routes/types/types';

// need to complete
const errorCode: Partial<Record<APIError, number>> = {
  [APIError.MISSED_TOKEN]: 401,
  [APIError.TOKEN_NOT_VALID]: 403,
};

export const endpointRespond = (res: Response): EndpointRes => ({
  SuccessResponse: (data = {}, status = 200): void => {
    res.status(status).json(data).end();
  },
  FailureResponse: (error: APIError): void => {
    res
      .status(errorCode[error] || 400)
      .json({ error })
      .end();
  },
});

export const logging = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

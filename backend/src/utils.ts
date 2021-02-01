import express from 'express';

export const endpointRespond = (res: express.Response) => ({
  SuccessResponse: (data: any, status = 200): void => {
    res.status(status).json(data).end();
  },
  FailureResponse: (message = 'Bad request.', status = 400): void => {
    res.status(status).json({ message }).end();
  },
});

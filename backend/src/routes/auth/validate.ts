import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { secrets } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { getClientInfo, getStatements } from '../monobank/endpoints';
import { categorize } from '../monobank/paymentsProcessing';
import { startMonth, statementUpdate } from '../monobank/utils';
import { isFailedFetchMono, isFailure } from '../types/guards';
import { MonoAccount, Tables } from '../types/types';
import { isValidPassword, isValidUsername, setHook } from './utils';

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

const validateStatement = (xtoken: string, username: string) => async ({
  id: account,
}: MonoAccount): Promise<void> => {
  const currentMonth = startMonth('cur');
  const monoRawStatements = await getStatements(
    { account, from: currentMonth, to: startMonth('next') },
    xtoken
  );
  if (!isFailedFetchMono(monoRawStatements)) {
    const statement = await getItem(Tables.STATEMENTS, {
      accountId: account,
    });
    if (!isFailure(statement)) {
      if (
        statement.Item[currentMonth].rawData.length !== monoRawStatements.length
      ) {
        const categorizedData = categorize(monoRawStatements);

        await statementUpdate(
          account,
          username,
          currentMonth,
          monoRawStatements,
          categorizedData
        );
      }
    }
  }
};

export const validateWebhook = async (
  xtoken: string,
  name: string
): Promise<void> => {
  const validateToken = await getClientInfo(xtoken);
  if (!isFailedFetchMono(validateToken)) {
    const { webHookUrl, accounts } = validateToken;

    if (webHookUrl !== 'https://api.beeeee.es/hook') {
      setHook(xtoken);
      accounts.map(validateStatement(xtoken, name));
    }
  }
};

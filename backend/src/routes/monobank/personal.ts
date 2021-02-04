import { Router } from 'express';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { getItem } from '../../dynamoAPI';
import { endpointRespond } from '../../utils';
import { authenticateToken } from '../auth/validate';
import { isFailure } from '../types/guards';
import { requests } from './endpoints';

export const personalInfo = Router();

export const currencyCode = {
  980: 'UAH',
  985: 'PLN',
  840: 'USD',
  978: 'EUR',
};

type MonoClientInfo = {
  clientId: string;
  name: string;
  webHookUrl: string;
  accounts: MonoAccount[];
};

type MonoAccount = {
  id: string;
  currencyCode: number;
  cashbackType: string;
  balance: number;
  creditLimit: number;
  maskedPan: string[];
  type: string;
  iban: string;
};

type ClientInfo = {
  name: string;
  webHookUrl: string;
  accounts: Account[];
};

type Account = {
  id: string;
  currencyCode: number;
  balance: number;
  creditLimit: number;
  type: string;
};

const updatePersonalInfo = ({
  name,
  webHookUrl,
  accounts,
}: MonoClientInfo): ClientInfo => {
  // put to db
  return {
    name,
    webHookUrl,
    accounts,
  };
};

personalInfo.get('/personal', authenticateToken, async (req: any, res) => {
  const userFromDB = await getItem(configs.USER_TABLE, {
    username: req.user.data,
  });
  const respond = endpointRespond(res);
  if (!isFailure(userFromDB)) {
    const data = await fetch(requests.personal(), {
      headers: {
        'X-Token': userFromDB.Item.xtoken,
      },
    }).then((el) => el.json());
    const info = updatePersonalInfo(data);
    return respond.SuccessResponse(info);
  } else return respond.FailureResponse('Failed to get user info.');
});

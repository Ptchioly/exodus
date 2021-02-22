import fetch from 'node-fetch';
import {
  MonoClientInfo,
  MonoFailedFetch,
  MonoStatements,
} from '../types/types';

export const endpoint = (path: string): string =>
  `https://api.monobank.ua/${path}`;

export const requests = {
  statement: (account: 0 | string, from: number, to?: number): string =>
    endpoint(`personal/statement/${account}/${from}/${to}`),
  personal: (): string => endpoint('personal/client-info'),
  webhook: (): string => endpoint('personal/webhook'),
};

const options = (xtoken: string) => ({
  headers: {
    'X-Token': xtoken,
  },
});

export const getClientInfo = async (
  xtoken: string
): Promise<MonoClientInfo | MonoFailedFetch> =>
  await fetch(requests.personal(), options(xtoken)).then((el) => el.json());

export const getStatements = async (
  { account, from, to }: any,
  xtoken: string
): Promise<MonoStatements | MonoFailedFetch> =>
  await fetch(
    requests.statement(account, from, to),
    options(xtoken)
  ).then((el) => el.json());

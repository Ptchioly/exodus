import fetch from 'node-fetch';

export const endpoint = (path: string): string =>
  `https://api.monobank.ua/${path}`;

export const requests = {
  statement: (account: 0 | string, from: number, to?: number): string =>
    endpoint(`personal/statement/${account}/${from}/${to}`),
  personal: (): string => endpoint('personal/client-info'),
  webhook: (): string => endpoint('personal/webhook'),
};

export const getClientInfo = async (xtoken: string) =>
  await fetch(requests.personal(), {
    headers: {
      'X-Token': xtoken,
    },
  }).then((el) => el.json());

export const getStatements = async (
  { account, from, to }: any,
  xtoken: string
) =>
  await fetch(requests.statement(account, from, to), {
    headers: {
      'X-Token': xtoken,
    },
  }).then((el) => el.json());

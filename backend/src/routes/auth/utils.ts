import { SHA3 } from 'crypto-js';
import fetch from 'node-fetch';
import { configs } from '../../config';
import { requests } from '../monobank/endpoints';
import { Account, MonoAccount } from '../types/types';

export const hash = (password: string, salt: string): string =>
  SHA3(password + SHA3(salt + 'sobaka')).toString();

export const getAccounts = (accounts: MonoAccount[]): Account[] => {
  return accounts
    .filter((account) => account.balance !== 0)
    .map((account) => {
      return {
        id: account.id,
        type: account.type,
        balance: account.balance,
        pan: account.maskedPan,
        currency: configs.CURRENCY_CODE[account.currencyCode],
      };
    });
};

export const setHook = async (xtoken: string): Promise<void> => {
  await fetch(requests.webhook(), {
    method: 'POST',
    headers: {
      'X-Token': xtoken,
    },
    body: JSON.stringify({
      webHookUrl: 'https://api.beeeee.es/hook',
    }),
  })
    .then(console.log)
    .catch(console.log);
};

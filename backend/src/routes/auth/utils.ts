import { SHA3 } from 'crypto-js';
import fetch from 'node-fetch';
import { requests } from '../monobank/endpoints';
import { MonoAccount } from '../types/types';

export const hash = (password: string, salt: string): string =>
  SHA3(password + SHA3(salt + 'sobaka')).toString();

const reLower = /[a-z]/;
const reUpper = /[A-Z]/;
const reNumber = /[0-9]/;
const reWhitespace = /\s/;
const reTwelweNumbers = /^[0-9]{12}$/;

export const isValidPassword = (password: string): boolean =>
  password.length >= 8 &&
  !reWhitespace.test(password) &&
  reLower.test(password) &&
  reUpper.test(password) &&
  reNumber.test(password);

export const isValidUsername = (username: string): boolean =>
  username.length === 12 &&
  Number(username) !== NaN &&
  reTwelweNumbers.test(username);

export const getAccounts = (accounts: MonoAccount[]): string[] =>
  accounts.filter((acc) => acc.balance !== 0).map((acc) => acc.id);

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

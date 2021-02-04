import { AES, enc } from 'crypto-js';

export const encrypt = (password: string, key: string): string =>
  AES.encrypt(password, key).toString();

export const decrypt = (encryptedPassword: string, key: string): string =>
  AES.decrypt(encryptedPassword, key).toString(enc.Utf8);

const reLower = /[a-z]/;
const reUpper = /[a-z]/;
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

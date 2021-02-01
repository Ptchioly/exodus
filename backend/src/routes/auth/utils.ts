import { AES, enc } from 'crypto-js';

export const encrypt = (password: string, key: string): string =>
  AES.encrypt(password, key).toString();

export const decrypt = (encryptedPassword: string, key: string): string =>
  AES.decrypt(encryptedPassword, key).toString(enc.Utf8);

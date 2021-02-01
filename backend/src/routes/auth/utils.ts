import { AES, enc } from 'crypto-js';

export const encrypt = (password: string, key: string): string =>
  AES.encrypt(password, key).toString();

export const decrypt = (encryptedPassword: string, key: string): string =>
  AES.decrypt(encryptedPassword, key).toString(enc.Utf8);

// export const isLoggedIn = (req: any) => !!req.session.userId;

// export const logIn = (req: any, userId: string) => {
//   req.session.userId = userId;
//   req.session.createdAt = Date.now();
// };

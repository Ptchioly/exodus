import type { Validator } from './types/Layout';

const isUpper = (char: string): boolean => char === char.toUpperCase();

export const validatePassword: Validator = (pwd?: string): boolean =>
  pwd && pwd.length >= 8 && /.{8,}/.test(pwd) && [...pwd].some(isUpper);

export const validatePhone: Validator = (number?: string): boolean =>
  number && number.length === 10 && Number(number) !== NaN;

export const waitFor = (seconds: number): Promise<void> =>
  new Promise((res) => setTimeout(res, seconds * 1000));

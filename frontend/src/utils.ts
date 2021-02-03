const isUpper = (char: string): boolean => char === char.toUpperCase();

export const validatePassword = (pwd?: string): boolean =>
  pwd && pwd.length >= 8 && /.{8,}/.test(pwd) && [...pwd].some(isUpper);

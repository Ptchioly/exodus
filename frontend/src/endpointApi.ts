import type { LoginResponse } from './types.ts/Api';

const baseUrl: string = process.env.host;
const loginEndpoint = baseUrl.concat('/login');

const defaultInit: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<LoginResponse> => {
  console.log(baseUrl);

  const response = await fetch(loginEndpoint, {
    ...defaultInit,
    method: 'POST',
    body: JSON.stringify({
      username: phoneNumber,
      password: pwd,
    }),
  });

  const { status } = response;

  if (status === 200) {
    const { user_id } = await response.json();
    return { status, user_id };
  }

  const { message } = await response.json();
  return { status, message };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const authEndpoint = baseUrl.concat('/authentication');
  const { ok } = await fetch(authEndpoint, defaultInit);
  return ok;
};

export const logout = async (): Promise<void> => {
  await fetch(baseUrl.concat('/logout'), defaultInit);
};

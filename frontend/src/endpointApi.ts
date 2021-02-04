import type { APIResponse } from './types/Api';

const baseUrl: string = process.env.host;
const loginEndpoint = baseUrl.concat('/login');
const authEndpoint = baseUrl.concat('/authentication');
const signupEndpoint = baseUrl.concat('/signup');
const logoutEndpoint = baseUrl.concat('/logout');

const defaultInit: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<APIResponse> => {
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
  const { ok } = await fetch(authEndpoint, defaultInit);
  return ok;
};

export const logout = async (): Promise<void> => {
  await fetch(logoutEndpoint, defaultInit);
};

export const signUp = async (
  phoneNumber: string,
  pwd: string,
  monoToken: string
): Promise<APIResponse> => {
  const response = await fetch(signupEndpoint, {
    method: 'POST',
    body: JSON.stringify({
      phoneNumber,
      pwd,
      monoToken,
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

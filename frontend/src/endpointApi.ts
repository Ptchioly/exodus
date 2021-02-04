import type { APIResponse, UserInfo } from './types/Api';

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
): Promise<APIResponse<{ user_id: string }>> => {
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
    return { status, data: { user_id } };
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { ok } = await fetch(authEndpoint, defaultInit);
  return ok;
};

export const logout = async (): Promise<void> => {
  await fetch(logoutEndpoint, defaultInit);
};

export const signUp = async (
  username: string,
  password: string,
  xtoken: string
): Promise<APIResponse<{ user_id: string }>> => {
  const t = {
    ...defaultInit,
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      xtoken,
    }),
  };
  console.log('t', t);
  const response = await fetch(signupEndpoint, t);

  const { status } = response;

  if (status === 200) {
    const { user_id } = await response.json();
    return { status, data: { user_id } };
  }

  const { message } = await response.json();
  return { status, message };
};

export const getUserInfo = async (): Promise<APIResponse<UserInfo>> => {
  const response = await fetch(baseUrl.concat('/personal'), defaultInit);

  const { status } = response;

  if (status === 200) {
    const userInfo: UserInfo = await response.json();
    return { status, data: userInfo };
  }

  const { message } = await response.json();
  return { status, message };
};

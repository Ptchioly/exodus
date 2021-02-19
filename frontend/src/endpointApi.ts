import type { APIResponse, Statement, UserInfo } from './types/Api';

const baseUrl: string = process.env.host;
const loginEndpoint = `${baseUrl}/login`;
const authEndpoint = `${baseUrl}/authentication`;
const signupEndpoint = `${baseUrl}/signup`;
const logoutEndpoint = `${baseUrl}/logout`;
const statementsEndpoint = `${baseUrl}/statement`;
const limitsEndpoint = `${baseUrl}/limit`;
const updateInfoEndpoint = `${baseUrl}/updateInfo`;
const deleteUserEndpoint = `${baseUrl}/deleteUser`;

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
  } else {
    const { message } = await response.json();
    return { status, message };
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

export const getStatement = async (): Promise<
  APIResponse<{ current: Statement[]; previous?: Statement[] }>
> => {
  const response = await fetch(statementsEndpoint, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });

  const resp: APIResponse = response.ok
    ? { data: await response.json(), status: 200 }
    : { status: response.status, message: await response.text() };

  return resp;
};

export const updateLimit = async (
  category: string,
  value: number
): Promise<void> => {
  await fetch(limitsEndpoint, {
    ...defaultInit,
    method: 'POST',
    body: JSON.stringify({
      category,
      value,
    }),
  });
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<APIResponse<{ user_id: string }>> => {
  const response = await fetch(updateInfoEndpoint, {
    method: 'POST',
    ...defaultInit,
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });

  const { status } = response;

  if (status !== 200) {
    const { message } = await response.json();
    return { status, message };
  } else {
    const { user_id } = await response.json();
    return { status, data: { user_id } };
  }
};

export const updateXToken = async (
  newXtoken: string
): Promise<APIResponse<{ user_id: string }>> => {
  const response = await fetch(updateInfoEndpoint, {
    method: 'POST',
    ...defaultInit,
    body: JSON.stringify({
      newXtoken,
    }),
  });

  const { status } = response;

  if (status !== 200) {
    const { message } = await response.json();
    return { status, message };
  } else {
    const { user_id } = await response.json();
    return { status, data: { user_id } };
  }
};

export const deleteUser = async (): Promise<
  APIResponse<{ user_id: string }>
> => {
  const response = await fetch(deleteUserEndpoint, {
    ...defaultInit,
    method: 'DELETE',
  });

  const { status } = response;

  if (status !== 200) {
    const { message } = await response.json();
    return { status, message };
  } else {
    const { user_id } = await response.json();
    return { status, data: { user_id } };
  }
};

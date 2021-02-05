import type { APIResponse } from './types/Api';

const baseUrl: string = process.env.host;
const loginEndpoint = baseUrl.concat('/login');
const authEndpoint = baseUrl.concat('/authentication');
const signupEndpoint = baseUrl.concat('/signup');
const logoutEndpoint = baseUrl.concat('/logout');
const statementsEndpoint = baseUrl.concat('/statement');

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
  username: string,
  password: string,
  xtoken: string
): Promise<APIResponse> => {
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
    return { status, user_id };
  }

  const { message } = await response.json();
  return { status, message };
};

const getPreviousMonth = (
  currentMonth: number,
  currentYear: number
): { from: number; to: number } => {
  const previousMonth = currentMonth > 0 ? currentMonth - 1 : 11;
  const yearCheck = previousMonth !== 11 ? currentYear : currentYear - 1;
  return {
    from: new Date(yearCheck, previousMonth).valueOf(),
    to: new Date(currentYear, currentMonth).valueOf(),
  };
};

const getDateRange = (
  currentDate: number,
  month: 'previous' | 'current'
): { from: number; to: number } => {
  const date = new Date(currentDate);
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  if (month === 'current')
    return {
      from: new Date(currentYear, currentMonth).valueOf(),
      to: currentDate,
    };
  else return getPreviousMonth(currentMonth, currentYear);
};

export const getStatement = async (
  date: number,
  month: 'previous' | 'current'
): Promise<any> => {
  const { from, to } = getDateRange(date, month);
  return await fetch(statementsEndpoint, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    method: 'POST',
    body: JSON.stringify({
      account: 0,
      from,
      to,
    }),
  }).then((res) => res.json);
};

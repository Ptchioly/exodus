//"process is not defined" is lie
const baseUrl: string = process.env.host;
const loginEndpoint = baseUrl.concat('/login');

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<boolean> => {
  console.log(baseUrl);
  return fetch(loginEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: phoneNumber,
      password: pwd,
    }),
  }).then(({ ok }) => ok);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const authEndpoint = baseUrl.concat('/authentication');
  return fetch(authEndpoint, {
    credentials: 'include',
  }).then(({ ok }) => ok);
};

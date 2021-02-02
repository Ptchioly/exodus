//"process is not defined" is lie
const baseUrl: string = process.env.host;
const loginEndpoint = baseUrl.concat('/login');

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<any> => {
  console.log(baseUrl);
  const response = await fetch(loginEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: phoneNumber,
      password: pwd,
    }),
  });

  console.log(response.headers);
  const authEndpoint = baseUrl.concat('/authentication');

  const code = await fetch(authEndpoint, {
    credentials: 'include',
  }).then((el) => el.status);
  if (code === 200)
    window.location.href = window.location.href
      .slice(0, window.location.href.lastIndexOf('/'))
      .concat('/home');
  else {
    alert('Ti ne Ptchiola');
    // location.reload();
  }
};

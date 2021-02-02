// const baseUrl = 'http://ec2-18-195-116-110.eu-central-1.compute.amazonaws.com';
const devUrl = 'http://localhost';
const loginEndpoint = devUrl.concat('/login');

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<any> => {
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
  const authEndpoint = devUrl.concat('/authentication');

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

import fetch from 'node-fetch';

const baseUrl = 'http://ec2-18-195-116-110.eu-central-1.compute.amazonaws.com';
const loginEndpoint = baseUrl.concat('/login');

export const signIn = async (
  phoneNumber: string,
  pwd: string
): Promise<any> => {
  return await fetch(loginEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: phoneNumber,
      pwd,
    }),
  });
};

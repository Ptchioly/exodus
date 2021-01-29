import { Router } from 'express';
const users = [
  {
    phone: '38097',
    pwd: 'qwe',
    xtoken: 'qwe',
  },
];

export const auth = Router();

auth.post('/login', (req, res) => {
  const { phone, pwd } = JSON.parse(req.body);
  console.log(
    'INFO ~ file: mobileAuth.ts ~ line 14 ~ auth.post ~ req.body',
    req.body
  );
  // request db for existed user
  const user = users.find((el) => el.phone === phone && el.pwd === pwd);
  if (user) {
    res.send('Hi' + user.phone);
    // create session
  } else res.send('Unauthorized user');
  //
});

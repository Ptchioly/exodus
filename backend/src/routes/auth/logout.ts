import { Router } from 'express';
import { endpointRespond } from '../../utils';

export const logout = Router().get('/logout', async (req, res) => {
  res.clearCookie('jwt');
  return endpointRespond(res).SuccessResponse({});
});

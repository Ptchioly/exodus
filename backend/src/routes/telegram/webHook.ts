import { Router } from 'express';
import { endpointRespond } from '../../utils';
import {
  processContact,
  sendTelegramMessage,
  startTelegramBody,
} from './sendMessage';

export const telegramBot = Router().post('/telegram', async (req, res) => {
  const { message } = req.body;
  if (!message) return endpointRespond(res).SuccessResponse();
  if (message.text === '/start') {
    return await sendTelegramMessage(res, message.chat.id)(
      'Send me a contact to receive statements and limit alerts. 🐝',
      startTelegramBody()
    );
  }
  if (message.contact) {
    return await processContact(res, message);
  }
  return await sendTelegramMessage(res, message.chat.id)(`🦜 ${message.text}`);
});

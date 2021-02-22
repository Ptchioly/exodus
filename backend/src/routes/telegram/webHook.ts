import { Router } from 'express';
import { endpointRespond } from '../../utils';
import {
  processContact,
  sendTelegramMessage,
  startTelegramBody,
} from './sendMessage';

export const telegramBot = Router().post('/telegram', async (req, res) => {
  const { message } = req.body;
  const respond = endpointRespond(res);
  if (!message) return respond.SuccessResponse();
  if (message.text === '/start') {
    await sendTelegramMessage(message.chat.id)(
      'Send me a contact to receive statements and limit alerts. 🐝',
      startTelegramBody()
    );
    return respond.SuccessResponse();
  }
  if (message.contact) {
    await processContact(message);
    return respond.SuccessResponse();
  }

  await sendTelegramMessage(message.chat.id)(`🦜 ${message.text}`);
  return respond.SuccessResponse();
});

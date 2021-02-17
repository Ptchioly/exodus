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
    await sendTelegramMessage(message.chat.id)(
      'Send me a contact to receive statements and limit alerts. 🐝',
      startTelegramBody()
    );
    return endpointRespond(res).SuccessResponse();
  }
  if (message.contact) {
    return await processContact(res, message);
  }

  await sendTelegramMessage(message.chat.id)(`🦜 ${message.text}`);
  return endpointRespond(res).SuccessResponse();
});

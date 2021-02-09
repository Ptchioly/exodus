import { Router } from 'express';
import { configs, secrets } from '../../config';
import fetch from 'node-fetch';
import { endpointRespond } from '../../utils';
import { getItem, updateItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';

const telegramURL = `https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}`;

export const startTelegramBody = (message: any) => ({
  chat_id: message.chat.id,
  text: 'Send me a contact to receive statements and limit alerts. 🐝',
  reply_markup: {
    keyboard: [
      [
        {
          text: 'Okay, that is my contact! 🤷',
          request_contact: true,
        },
      ],
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  },
});

export const sendTelegramMessage = (res: any) => async (body: any) => {
  await fetch(`${telegramURL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (!json.ok) console.log('Error on start;', json.description);
    })
    .catch(console.log);
  return endpointRespond(res).SuccessResponse();
};

const processContact = async (
  res: any,
  { contact: { user_id, phone_number, first_name }, chat: { id } }: any
) => {
  const sendMessage = sendTelegramMessage(res);
  if (user_id === id) {
    // Is there always will be phone? Maybe hidden?
    const [username] = /(380\d{9})/.exec(phone_number) as RegExpExecArray;
    const userResponse = await getItem(configs.USER_TABLE, { username });
    if (isFailure(userResponse) || !userResponse.Item)
      return await sendMessage({
        chat_id: id,
        text:
          'You are not registered in exodus, visit https://www.beeeee.es! 🙅',
      });
    if (userResponse.Item.telegramId) {
      return await sendMessage({
        chat_id: id,
        text: `${first_name}, you already subscribed! 🤙`,
      });
    }
    await updateItem(configs.USER_TABLE, { username }, { telegramId: user_id });
    return await sendMessage({
      chat_id: id,
      text: 'You subscribed! 🦄',
    });
  } else {
    return await sendMessage({
      chat_id: id,
      text: "It's not your contact!! 👺",
    });
  }
};

export const telegramBot = Router().post('/telegram', async (req, res) => {
  const { message } = req.body;
  if (!message) return endpointRespond(res).SuccessResponse();
  if (message.text === '/start') {
    return await sendTelegramMessage(res)(startTelegramBody(message));
  }
  if (message.contact) {
    return await processContact(res, message);
  }
  return await sendTelegramMessage(res)({
    chat_id: message.chat.id,
    text: `🦜 ${message.text}`,
  });
});

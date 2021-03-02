import fetch from 'node-fetch';
import { secrets } from '../../config';
import { getItem, updateItem } from '../../dynamoAPI';
import { isFailure } from '../types/guards';
import { Tables } from '../types/types';

const telegramURL = `https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}`;

export const startTelegramBody = () => ({
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

export const sendTelegramMessage = (chat_id: string) => async (
  text: string,
  startBody = {}
): Promise<void> => {
  await fetch(`${telegramURL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chat_id, text, ...startBody }),
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (!json.ok) console.log('Error on start;', json.description);
    })
    .catch(console.log);
};

export const processContact = async ({
  contact: { user_id, phone_number, first_name },
  chat: { id },
}: any): Promise<void> => {
  const sendMessage = sendTelegramMessage(id);
  if (user_id === id) {
    // Is there always will be phone? Maybe hidden?
    const [username] = /(380\d{9})/.exec(phone_number) as RegExpExecArray;
    const userResponse = await getItem(Tables.USERS, { username });
    if (isFailure(userResponse) || !userResponse.Item)
      return await sendMessage(
        'You are not registered in exodus, visit https://www.beeeee.es! 🙅'
      );
    if (userResponse.Item.telegramId) {
      return await sendMessage(`${first_name}, you already subscribed! 🤙`);
    }
    await updateItem(Tables.USERS, { username }, { telegramId: user_id });
    return await sendMessage('You subscribed! 🦄');
  } else {
    return await sendMessage("It's not your contact!! 👺");
  }
};

import { Router } from 'express';
import { secrets } from '../../config';
import fetch from 'node-fetch';

export const telegramBot = Router().post('/telegram', async (req, res) => {
  console.log(req.body);
  const { message } = req.body;
  // check mess
  if (message.text === '/start') {
    console.log('text -> ', message.text);
    fetch(`https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: message.chat.id,
        text: 'Send me a contact 🐝',
        reply_markup: {
          keyboard: [
            [
              {
                text: 'My contact 🖕🏼',
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      } as any,
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (!json.ok) console.log('NOT OK', json.description);
        else console.log('OK', json.description);
      })
      .catch(console.log);
    return;
  }
  if (message.contact) {
    const { contact, chat } = message;
    if (contact.user_id === chat.id) {
      // save to bd
      //   "contact": {
      //     "phone_number": "+380730631835",
      //     "first_name": "Глеб",
      //     "user_id": 274403022
      //   }
      fetch(`https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: 'Contact saved 🦄',
        }),
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (!json.ok) console.log('NOT OK SEND', json.description);
          else console.log('OK SEND', json.description);
        })
        .catch(console.log);
      return;
    } else {
      fetch(`https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: "It's not your contact 👺",
        }),
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (!json.ok) console.log('NOT OK SEND2', json.description);
          else console.log('OK SEND2', json.description);
        })
        .catch(console.log);
    }
  }
  return;
});

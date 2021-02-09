import { Router } from 'express';
import { secrets } from '../../config';
import fetch from 'node-fetch';

export const logout = Router().get('/telegram', async (req, res) => {
  const { message } = req.body;
  // check mess
  if (message.text === '/start') {
    fetch(`https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/sendMessage`, {
      body: JSON.stringify({
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
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (!json.ok) console.log(json.description);
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
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: 'Contact saved 🦄',
        }),
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (!json.ok) console.log(json.description);
        })
        .catch(console.log);
      return;
    } else {
      fetch(`https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/sendMessage`, {
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: "It's not your contact 👺",
        }),
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (!json.ok) console.log(json.description);
        })
        .catch(console.log);
    }
  }
  return;
});

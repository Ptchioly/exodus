import { secrets } from '../../config';
import fetch from 'node-fetch';

const host = process.env.host || 'https://api.beeeee.es';

export const initTelegramBot = async (): Promise<void> =>
  await fetch(
    `https://api.telegram.org/${secrets.TELEGRAM_BOT_ID}/setWebhook?url=${host}/telegram`
  )
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json.description);
    })
    .catch(console.log);

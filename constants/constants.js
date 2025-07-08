import dotenv from "dotenv";
dotenv.config();

export const secrets = {
  port: process.env.PORT,
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  apiHash: process.env.API_HASH,
  apiId: process.env.API_ID,
  telegram_userId: process.env.TELEGRAM_USER_ID,
  admin_id: process.env.ADMIN_ID,

};

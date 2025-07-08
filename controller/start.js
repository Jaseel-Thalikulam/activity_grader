import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/NewMessage.js";
import { Api } from "telegram/tl/index.js";
import fs from "fs";
import { secrets } from "../constants/constants.js";
import { notifyUser } from "../helper/helpers.js";

const ADMIN_ID = secrets.admin_id;

// Load session if exists
let sessionString = "";
if (fs.existsSync("session.txt")) {
  sessionString = fs.readFileSync("session.txt", "utf8");
}
const session = new StringSession(sessionString);

export async function Start() {
  const client = new TelegramClient(
    session,
    Number(secrets.apiId),
    secrets.apiHash,
    { connectionRetries: 5 }
  );

  try {
    await client.start({
      botAuthToken: secrets.botToken,
      onError: (err) => console.log("Login error:", err),
    });

    // Save session to file
    const newSession = client.session.save();
    fs.writeFileSync("session.txt", newSession);

    console.log("🤖 Bot started successfully!");

    // client.addEventHandler(async (event) => {
    //   const message = event.message;
    //   console.log("Message received:", message.text, message.peerId.userId);
    // }, new NewMessage({}));

    client.addEventHandler(async (update) => {
      if (update.className !== "UpdateBotMessageReaction") return;
      // console.log("Update received:", update);
      // console.log("actor UserId:", update.actor.userId.value);
      const actorId = update.actor.userId.value;

      // console.log("peer UserId:", update.peer.userId.value);
      const chatId =
        update.peer?.userId || update.peer?.channelId || update.peer?.chatId;
      const msgId = update.msgId;
      // console.log(update)

      try {
        const messages = await client.getMessages(chatId, { ids: [msgId] });
        const message = messages[0];
        const senderId =
          message.fromId?.userId?.value || message.fromId?.channelId?.value;
        const sender = await client.getEntity(senderId);
        const senderName = `${sender.firstName ?? ""} ${
          sender.lastName ?? ""
        }`.trim();
        const user = await client.getEntity(actorId);
        const senderUsername = sender.username ?? "(no username)";
        const username = user.username ?? "(no username)";

        const fullName = `${user.firstName ?? ""} ${
          user.lastName ?? ""
        }`.trim();

        let updateStatus = update.newReactions.length > 0 ? true : false;

        if (updateStatus) {
          const reaction = update.newReactions[0];
          console.log(
            `✅  ${fullName} (@${username}) added ${reaction.emoticon}  to a message from: ${senderName} (@${senderUsername})`
          );
        } else {
          const reaction = update.oldReactions[0];
          console.log(
            `❌  ${fullName} (@${username}) removed ${reaction.emoticon} from a message from: ${senderName} (@${senderUsername})`
          );
        }

        // console.log(`👤 Reaction sent by: ${fullName} (@${username})`);
      } catch (err) {
        console.error("Failed to get user entity:", err);
      }

      // if (update.newReactions && update.newReactions.length > 0) {
      //   const reaction = update.newReactions[0];
      //   console.log(`Reaction: ${reaction.emoticon}`);
      // }

      // console.log(
      //   `💬 Reaction received in Chat ${chatId} on Message ${msgId}:`
      // );
    });

    console.log("🤖 Bot is live and monitoring.");
  } catch (error) {
    console.error("⚠️ Error:", error);
    await notifyUser(client, `⚠️ Error: ${error.message}`);
  }
}

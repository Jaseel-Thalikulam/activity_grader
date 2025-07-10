import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/NewMessage.js";
import fs from "fs";
import { secrets } from "../constants/constants.js";
import { extractReactionContext } from "../util/reactionUtils.js";
import { addPoints, subtractPoints } from "../repository/index.js";

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

    client.addEventHandler(async (update) => {
      if (update.className !== "UpdateBotMessageReaction") return;

    
      try {
        const { senderName, senderUsername, fullName, username, senderId } =
          await extractReactionContext(update, client);

        const updateStatus = update.newReactions.length > 0;

        if (updateStatus) {
          const reaction = update.newReactions[0];

          addPoints(senderId);
          
          console.log(
            `✅  ${fullName} (@${username}) added ${reaction.emoticon}  to a message from: ${senderName} (@${senderUsername})`
          );
        } else {
          const reaction = update.oldReactions[0];
          subtractPoints(senderId);
          console.log(
            `❌  ${fullName} (@${username}) removed ${reaction.emoticon} from a message from: ${senderName} (@${senderUsername})`
          );
        }
      } catch (err) {
        console.error("Failed to get user entity:", err);
      }
    });

    console.log("🤖 Bot is live and monitoring.");
  } catch (error) {
    console.error("⚠️ Error:", error);
  }
}



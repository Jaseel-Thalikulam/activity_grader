import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/NewMessage.js";
import fs from "fs";
import { secrets } from "../constants/constants.js";
import { extractReactionContext } from "../util/reactionUtils.js";
import { addPoints, subtractPoints } from "../repository/index.js";
import { recognizeReactionsAndTrackPoints } from "./reactions.controller.js";

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

    recognizeReactionsAndTrackPoints(client);

    


    console.log("🤖 Bot is live and monitoring.");
  } catch (error) {
    console.error("⚠️ Error:", error);
  }
}

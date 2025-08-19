import { checkIsAdmin } from "./checkIsAdmin.js";

export async function extractReactionContext(update, client) {
  const actorId = Number(update.actor.userId.value);

  const chatId =
    update.peer?.userId || update.peer?.channelId || update.peer?.chatId;
  const msgId = update.msgId;

  const messages = await client.getMessages(chatId, { ids: [msgId] });
  const message = messages[0];

  const senderId =
    message.fromId?.userId?.value || message.fromId?.channelId?.value;

  const sender = await client.getEntity(senderId);
  const user = await client.getEntity(actorId);
  const isActorAdmin = await checkIsAdmin(client, chatId, actorId);
  const isSenderAdmin = await checkIsAdmin(client, chatId, senderId);

  return {
    senderName: `${sender.firstName ?? ""} ${sender.lastName ?? ""}`.trim(),
    senderUsername: sender.username ?? "(no username)",
    actorFullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    actorUsername: user.username ?? "(no username)",
    msgId,
    chatId,
    senderId,
    actorId,
    isActorAdmin,
    isSenderAdmin,
  };
}

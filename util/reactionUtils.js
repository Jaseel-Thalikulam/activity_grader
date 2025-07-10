export async function extractReactionContext(update, client) {
  const actorId = update.actor.userId.value;
  const chatId =
    update.peer?.userId || update.peer?.channelId || update.peer?.chatId;
  const msgId = update.msgId;

  const messages = await client.getMessages(chatId, { ids: [msgId] });
  const message = messages[0];

  const senderId =
    message.fromId?.userId?.value || message.fromId?.channelId?.value;

  const sender = await client.getEntity(senderId);
  const user = await client.getEntity(actorId);

  return {
    senderName: `${sender.firstName ?? ""} ${sender.lastName ?? ""}`.trim(),
    senderUsername: sender.username ?? "(no username)",
    fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    username: user.username ?? "(no username)",
    msgId,
    chatId,
    senderId,
  };
}

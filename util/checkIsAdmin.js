import { Api } from "telegram";
export async function checkIsAdmin(client, chatId, actorId) {
  let isAdmin = false;
  try {
    const participant = await client.invoke(
      new Api.channels.GetParticipant({
        channel: chatId, // can pass username, ID, or channel entity
        participant: actorId,
      })
    );

    const className = participant.participant.className;
    if (
      className === "ChannelParticipantAdmin" ||
      className === "ChannelParticipantCreator"
    ) {
      isAdmin = true;
    }
    return isAdmin;
  } catch (err) {
    console.error("Failed to get participant info:", err);
  }
}

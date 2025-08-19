import { addPoints, subtractPoints } from "../repository/index.js";
import { extractReactionContext } from "../util/reactionUtils.js";


export function recognizeReactionsAndTrackPoints(client) {
    client.addEventHandler(async (update) => {
      if (update.className !== "UpdateBotMessageReaction") return;

      try {
        const {
          senderName,
          senderUsername,
          actorFullName,
          actorUsername,
          senderId,
          isActorAdmin,
          isSenderAdmin
        } = await extractReactionContext(update, client);

        if (!isActorAdmin || isSenderAdmin) return;
        
        console.log(senderName, senderUsername, senderId, isSenderAdmin,isActorAdmin);
        
        const updateStatus = update.newReactions.length > 0;

        if (updateStatus) {
          const reaction = update.newReactions[0];

          addPoints(senderId, senderUsername, senderName );

          console.log(
            `${actorFullName} (@${actorUsername}) added ${reaction.emoticon} to ${senderName}'s (@${senderUsername}) message`
          );

        } else {
          const reaction = update.oldReactions[0];
          subtractPoints(senderId,senderUsername, senderName);
          console.log(
            `${actorFullName} (@${actorUsername}) removed ${reaction.emoticon} from ${senderName}'s (@${senderUsername}) message`
          );
        }

      } catch (err) {
        console.error("Failed to get user entity:", err);
      }
    });

}
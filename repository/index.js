import participantsModel from "../models/participants.model.js";
import {tryCatchWrapper} from "../util/tryCatchWrapper.js";


const _addPoints = async (msgSenderId, username, firstName) => {
  console.log("Adding points for:", msgSenderId, username, firstName);
  await participantsModel.findOneAndUpdate(
    { telegramUserId: msgSenderId },
    {
      $inc: { telegramActivityPoints: 1 },
      $setOnInsert: {
        telegramUserId: msgSenderId,
        telegramUsername: username,
        telegramFullName: firstName,
      },
    },
    { upsert: true, new: true }
  );
};

const _subtractPoints = async (msgSenderId, username, firstName) => {
  const participant = await participantsModel.findOne({
    telegramUserId: msgSenderId,
  });

  if (!participant) {
    await participantsModel.create({
      telegramUserId: msgSenderId,
      telegramUsername: username,
      telegramFirstName: firstName,
      telegramActivityPoints: 0,
    });
  } else {
    await participantsModel.updateOne(
      { telegramUserId: msgSenderId },
      {
        $set: {
          telegramActivityPoints: Math.max(
            0,
            participant.telegramActivityPoints - 1
          ),
        },
      }
    );
  }
};


const _getResults = async () => {
  const results = await participantsModel
    .find({}, { telegramUserId: 1, telegramActivityPoints: 1,telegramFullName:1, _id: 0 })
    .sort({ telegramActivityPoints: -1 });
  return results.map((user) => ({
    id: user.telegramUserId,
    name: user.telegramFullName,
    username: user.telegramUsername || "(no username)",
    points: user.telegramActivityPoints,
  }));
};

const _getUserByTelegramId = async (telegramUserId) => {
  const user = await participantsModel.findOne(
    { telegramUserId },
    {
      telegramUserId: 1,
      telegramFullName: 1,
      telegramUsername: 1,
      telegramActivityPoints: 1,
      _id: 0,
    }
  );

  if (!user) {
    return { message: "User not found" };
  }

  return {
    id: user.telegramUserId,
    name: user.telegramFullName,
    username: user.telegramUsername || "(no username)",
    points: user.telegramActivityPoints,
  };
};

export const getUserByTelegramId = tryCatchWrapper(_getUserByTelegramId);
export const addPoints = tryCatchWrapper(_addPoints);
export const subtractPoints = tryCatchWrapper(_subtractPoints);
export const getResults = tryCatchWrapper(_getResults);
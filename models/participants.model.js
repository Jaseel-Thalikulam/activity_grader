import { Schema, Types, model } from "mongoose";

const participantsSchema = new Schema({
    telegramUserId: {
        type: String,required: true, unique: true
    },
    telegramUsername: {
        type: String, required: false
    },
    telegramFullName: {
        type: String, required: false
    },
    telegramActivityPoints: {
        type: Number, default: 0
    }
});

export default model(
  "participants",
  participantsSchema,
  "participants"
);``
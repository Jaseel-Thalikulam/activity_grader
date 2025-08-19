import express from "express";
import { secrets } from "./constants/constants.js";
import { Start } from "./controller/start.js";
import cron from "node-cron";
import { getResults } from "./repository/index.js";
import { connectMongoDB } from "./configs/mongoose.config.js";

const app = express();

Start();
connectMongoDB();
// Schedule a job every 2 minutes
cron.schedule("*/2 * * * *", async () => {
  const results =await getResults();
  console.log("📊 Points Table:", results); // or save/send somewhere
});

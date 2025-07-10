import express from "express";
import { secrets } from "./constants/constants.js";
import { Start } from "./controller/start.js";
import cron from "node-cron";
import { getResults } from "./repository/index.js";

const app = express();

app.get("/", (req, res) => res.json({ message: "Hello World 2.0" }));
Start();

function start() {
  const PORT = process.env.PORT || secrets.port || 3000;
  app.listen(PORT, () => {
    console.log(`✅ ${PORT} Everything is working fine.`);
  });
}

start();


// Schedule a job every 2 minutes
cron.schedule("*/2 * * * *", () => {
  const results = getResults();
  console.log("📊 Points Table:", results); // or save/send somewhere
});

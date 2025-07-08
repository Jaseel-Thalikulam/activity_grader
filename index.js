import express from "express";
import { secrets } from "./constants/constants.js";
import { Start } from "./controller/start.js";

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

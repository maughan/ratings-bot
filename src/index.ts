import "dotenv/config";

import { Client, Message } from "discord.js";
import mongoose from "mongoose";

import { handle } from "./services/Discord";

mongoose
  .connect(process.env.MONGO_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((e) => console.log(e))
  .then(() => console.log("Connected to MongoDB"));

const client = new Client();
const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message: Message) => {
  await handle(message);
});

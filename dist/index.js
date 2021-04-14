"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const mongoose_1 = __importDefault(require("mongoose"));
const Discord_1 = require("./services/Discord");
mongoose_1.default
    .connect(process.env.MONGO_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .catch((e) => console.log(e))
    .then(() => console.log("Connected to MongoDB"));
const client = new discord_js_1.Client();
const TOKEN = process.env.TOKEN;
client.login(TOKEN);
client.on("ready", () => {
    console.info(`Logged in as ${client.user.tag}!`);
});
client.on("message", async (message) => {
    await Discord_1.handle(message);
});

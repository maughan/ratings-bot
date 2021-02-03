require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const axios = require("axios");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"));

const UserSchema = {
  id: String,
  character: String,
  realm: String,
};

const UserModel = mongoose.model("User", UserSchema);

const generateEmbed = (data) => {
  return {
    color: 0x0099ff,
    title:
      data.player.charAt(0).toUpperCase() +
      data.player.slice(1) +
      "- Emerald Dream",
    url:
      "https://worldofwarcraft.com/en-gb/character/eu/emerald-dream/" +
      data.player,
    thumbnail: {
      url: data.avatar,
    },
    fields: [
      {
        name: "Rated Battlegrounds",
        value: data.rating,
      },
      {
        name: "Week",
        value:
          "Won: " + data.weeklyData.won + " - Lost: " + data.weeklyData.lost,
        inline: true,
      },
      {
        name: "Season",
        value:
          "Won: " + data.seasonData.won + " - Lost: " + data.seasonData.lost,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      text: "!rating - Trapjaw",
      icon_url:
        "https://avatars.githubusercontent.com/u/40720420?s=460&u=988adec866a594eaa04d45c39ca090d1dbe6564d&v=4",
    },
  };
};

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async (msg) => {
  if (msg.content.toLowerCase().split(" ")[0] === "!register") {
    const message = msg.content.toLowerCase().split(" ");
    if (message.length !== 3) {
      msg.channel.send(
        "Registration information incorrect. Format: !register <character name> <realm-name>"
      );
    } else {
      const character = message[1];
      const realm = message[2];
      const foundUser = await UserModel.findOne({ id: msg.author.id });
      if (foundUser) {
        msg.reply("you already have a character registered");
      } else {
        const user = await UserModel.create({
          id: msg.author.id,
          character,
          realm,
        });
        await user.save((err) => err && console.log(err));
        msg.reply(
          `character registered successfully: ${
            character.charAt(0).toUpperCase() + character.slice(1)
          } - ${
            realm.split("-")[0].charAt(0).toUpperCase() +
            realm.split("-")[0].slice(1) +
            " " +
            realm.split("-")[1].charAt(0).toUpperCase() +
            realm.split("-")[1].slice(1)
          }`
        );
      }
    }
  }
  if (msg.content === "!help") {
    msg.channel.send(
      "\n__**!help:**__ lists all functions.\n__**!register:**__ register a character, format:- !register <character name> <realm-name>\n__**!rating:**__ returns your registered characters current rating"
    );
  }
  if (msg.content === "!rating") {
    const player = await UserModel.findOne({ id: msg.author.id });
    if (!player) {
      msg.reply("No character registered");
    }
    console.log("making request for", player);
    const avatarData = await axios(
      `https://eu.api.blizzard.com/profile/wow/character/${player.realm}/${player.character}/character-media?namespace=profile-eu&locale=en_EU&access_token=${process.env.ACCESS_TOKEN}`
    )
      .then((res) => res.data)
      .catch((e) => console.log(e));
    const rbgData = await axios(
      `https://eu.api.blizzard.com/profile/wow/character/${player.realm}/${player.character}/pvp-bracket/rbg?namespace=profile-eu&locale=en_EU&access_token=${process.env.ACCESS_TOKEN}`
    )
      .then((res) => res.data)
      .catch((e) => console.log(e));
    await msg.channel.send({
      embed: generateEmbed({
        player: player.character,
        avatar: avatarData.assets[0].value,
        rating: rbgData.rating,
        weeklyData: rbgData.weekly_match_statistics,
        seasonData: rbgData.season_match_statistics,
      }),
    });
  }
});

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
  .catch((e) => console.log(e))
  .then(() => console.log("Connected to MongoDB"));

const UserSchema = {
  id: String,
  character: String,
  realm: String,
};

let ACCESS_TOKEN = "14242";

async function refreshToken() {
  console.log("refreshing token");
  const res = await axios({
    method: "post",
    url: "https://us.battle.net/oauth/token",
    headers: {
      Authorization:
        "Basic NmNhM2U3YjE2ZjI0NGI1YzkwNWNlOTg5NmIyNmQ5Nzg6U05wOVBVMGV0RmxiNTBPTk05WDI2YVpUZG0wMTZHSEw=",
      "content-type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  })
    .then((res) => res)
    .catch((e) => console.log("error:" + e));
  if (res) {
    ACCESS_TOKEN = res.data.access_token;
  }
}

async function handleAuthentication(url) {
  await refreshToken();
  return await axios(url + ACCESS_TOKEN)
    .then((res) => res)
    .catch((e) => console.log(e.message));
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatRealmName(realm) {
  return realm
    .split("-")
    .map((word) => capitalize(word))
    .filter((char) => char !== "-")
    .join(" ");
}

function formatMessage(message) {
  const messageArray = message.split(" ");
  const command = messageArray[0];
  const character = messageArray[1];
  const realm = messageArray[2];
  return {
    command,
    character,
    realm,
  };
}

const UserModel = mongoose.model("User", UserSchema);

const generateEmbed = (data) => {
  return {
    color: 0x0099ff,
    title: capitalize(data.character) + " - " + formatRealmName(data.realm),
    url: `https://worldofwarcraft.com/en-gb/character/eu/${data.realm}/${data.character}`,
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

async function fetchAvatar(realm, character) {
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/character-media?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : console.log(e.message)
    );

  return res.data.assets[0].value;
}

async function fetchPvPData(realm, character, bracket) {
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : console.log(e.message)
    );

  return res.data;
}

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async (msg) => {
  const message = formatMessage(msg.content);

  // SEARCH
  // -------------------------------

  if (message.command === "!search") {
    if (!message.character || !message.realm) {
      msg.channel.send(
        "Search information incorrect. Format: !search <character name> <realm-name>"
      );
    } else {
      const rbgData = await fetchPvPData(
        message.realm,
        message.character,
        "rbg"
      );
      await msg.channel.send({
        embed: generateEmbed({
          character: message.character,
          realm: message.realm,
          avatar: await fetchAvatar(message.realm, message.character),
          rating: rbgData.rating,
          weeklyData: rbgData.weekly_match_statistics,
          seasonData: rbgData.season_match_statistics,
        }),
      });
    }
  }

  // REGISTER
  // -------------------------------

  if (message.command === "!register") {
    if (!message.character || !message.realm) {
      msg.channel.send(
        "Registration information incorrect. Format: !search <character name> <realm-name>"
      );
    } else {
      const foundUser = await UserModel.findOne({ id: msg.author.id });
      if (foundUser) {
        msg.reply("you already have a character registered");
      } else {
        const user = await UserModel.create({
          id: msg.author.id,
          character: message.character,
          realm: message.realm,
        });
        await user.save((err) => err && console.log(err));
        msg.reply(
          `character registered successfully: ${capitalize(
            message.character
          )} - ${formatRealmName(message.realm)}`
        );
      }
    }
  }

  // HELP
  // -------------------------------

  if (message.command === "!help") {
    msg.channel.send(
      "\n__**!help:**__ lists all functions.\n__**!rbg:**__ register a character, format:- !register <character name> <realm-name>\n__**!rating:**__ returns your registered characters current rating\n__**!search:**__ returns a characters rating, format: !search <character name> <realm-name>"
    );
  }

  // RATING
  // -------------------------------

  if (message.command === "!rbg") {
    const player = await UserModel.findOne({ id: msg.author.id });
    if (!player) {
      msg.reply("No character registered");
    }
    console.log("making request for", player);

    const rbgData = await fetchPvPData(player.realm, player.character, "rbg");
    await msg.channel.send({
      embed: generateEmbed({
        character: player.character,
        realm: player.realm,
        avatar: await fetchAvatar(player.realm, player.character),
        rating: rbgData.rating,
        weeklyData: rbgData.weekly_match_statistics,
        seasonData: rbgData.season_match_statistics,
      }),
    });
  }
});

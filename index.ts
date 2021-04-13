import "dotenv.config";

import { Client } from "discord.js";
import axios from "axios";
import mongoose from "mongoose";

import { UserModel } from "./models/user";

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((e) => console.log(e))
  .then(() => console.log("Connected to MongoDB"));

let ACCESS_TOKEN = "";

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
    .catch((e) => {
      console.log(e.message, url);
      return { data: "error" };
    });
}

function formatPlayableRace(id) {
  switch (id) {
    case 1:
      return "Human";
    case 2:
      return "Orc";
    case 3:
      return "Dwarf";
    case 4:
      return "Night Elf";
    case 5:
      return "Undead";
    case 6:
      return "Tauren";
    case 7:
      return "Gnome";
    case 8:
      return "Troll";
    case 9:
      return "Goblin";
    case 10:
      return "Blood Elf";
    case 11:
      return "Draenei";
    case 22:
      return "Worgen";
    case 24:
    case 25:
    case 26:
      return "Pandaren";
    case 27:
      return "Nightborne";
    case 28:
      return "Highmountain Tauren";
    case 29:
      return "Void Elf";
    case 30:
      return "Lightforged Draenei";
    case 31:
      return "Zandalari Troll";
    case 32:
      return "Kul Tiran";
    case 34:
      return "Dark Iron Dwarf";
    case 35:
      return "Vulpera";
    case 36:
      return "Mag'har Orc";
    case 37:
      return "Mechagnome";
  }
}

function formatPlayerSpec(id) {
  switch (id) {
    case 62:
      return "Arcane";
    case 63:
      return "Fire";
    case 64:
    case 251:
      return "Frost";
    case 65:
    case 257:
      return "Holy";
    case 66:
      return "Protection";
    case 70:
      return "Retribution";
    case 71:
      return "Arms";
    case 72:
      return "Fury";
    case 73:
      return "Protection";
    case 102:
      return "Balance";
    case 103:
      return "Feral";
    case 104:
      return "Guardian";
    case 105:
    case 264:
      return "Restoration";
    case 250:
      return "Blood";
    case 252:
      return "Unholy";
    case 253:
      return "Beast Mastery";
    case 254:
      return "Marksmanship";
    case 255:
      return "Survival";
    case 256:
      return "Discipline";
    case 258:
      return "Shadow";
    case 259:
      return "Assassination";
    case 260:
      return "Outlaw";
    case 261:
      return "Subtlety";
    case 262:
      return "Elemental";
    case 263:
      return "Enhancement";
    case 265:
      return "Afflication";
    case 266:
      return "Demonology";
    case 267:
      return "Destruction";
    case 268:
      return "Brewmaster";
    case 269:
      return "Windwalker";
    case 270:
      return "Mistweaver";
    case 577:
      return "Havoc";
    case 581:
      return "Vengeance";
  }
}

function formatClass(id) {
  switch (id) {
    case 1:
      return "Warrior";
    case 2:
      return "Paladin";
    case 3:
      return "Hunter";
    case 4:
      return "Rogue";
    case 5:
      return "Priest";
    case 6:
      return "Death Knight";
    case 7:
      return "Shaman";
    case 8:
      return "Mage";
    case 9:
      return "Warlock";
    case 10:
      return "Monk";
    case 11:
      return "Druid";
    case 12:
      return "Demon Hunter";
  }
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
  const messageArray = message.toLowerCase().split(/[^A-Za-z!]/);
  const command = messageArray[0];
  const character = messageArray[1];
  const realm = messageArray.slice(2).join("-");
  return {
    command,
    character,
    realm,
  };
}

const generateEmbed = (data, type) => {
  switch (type) {
    case "rbg":
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
              "Won: " +
              data.weeklyData.won +
              " - Lost: " +
              data.weeklyData.lost,
            inline: true,
          },
          {
            name: "Season",
            value:
              "Won: " +
              data.seasonData.won +
              " - Lost: " +
              data.seasonData.lost,
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
    case "arena":
      return {
        color: 0x0099ff,
        title: capitalize(data.character) + " - " + formatRealmName(data.realm),
        url: `https://worldofwarcraft.com/en-gb/character/eu/${data.realm}/${data.character}`,
        thumbnail: {
          url: data.avatar,
        },
        fields: [
          {
            name: "2v2",
            value: data.two.rating,
            inline: true,
          },
          {
            name: "Week",
            value:
              "Won: " +
              data.two.weeklyData.won +
              " - Lost: " +
              data.two.weeklyData.lost,
            inline: true,
          },
          {
            name: "Season",
            value:
              "Won: " +
              data.two.seasonData.won +
              " - Lost: " +
              data.two.seasonData.lost,
            inline: true,
          },
          {
            name: "3v3",
            value: data.three.rating,
            inline: true,
          },
          {
            name: "Week",
            value:
              "Won: " +
              data.three.weeklyData.won +
              " - Lost: " +
              data.three.weeklyData.lost,
            inline: true,
          },
          {
            name: "Season",
            value:
              "Won: " +
              data.three.seasonData.won +
              " - Lost: " +
              data.three.seasonData.lost,
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
    case "characters":
      return {
        color: 0x0099ff,
        title: "Your registered characters:",
        fields: data.map((charData) => {
          return {
            name: `${capitalize(charData.character)} - ${formatRealmName(
              charData.realm
            )}`,
            value: `${formatPlayableRace(charData.race)} ${formatPlayerSpec(
              charData.spec
            )} ${formatClass(charData.class)}`,
          };
        }),
        timestamp: new Date(),
        footer: {
          text: "!rating - Trapjaw",
          icon_url:
            "https://avatars.githubusercontent.com/u/40720420?s=460&u=988adec866a594eaa04d45c39ca090d1dbe6564d&v=4",
        },
      };
    case "rio":
      return {
        color: 0x0099ff,
        title: capitalize(data.character) + " - " + formatRealmName(data.realm),
        url: `https://worldofwarcraft.com/en-gb/character/eu/${data.realm}/${data.character}`,
        thumbnail: {
          url: data.avatar,
        },
        fields: [
          {
            name: "Raider.io score",
            value: data.score,
            inline: true,
          },
          {
            name: "Raid progress",
            value: data.raid,
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
  }
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
        : { data: "error" }
    );

  return res.data.assets[0].value;
}

async function fetchCharacterDetails(realm, character) {
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/appearance?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data;
}

async function fetchRio(realm, character) {
  const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=${realm}&name=${character}&fields=mythic_plus_scores_by_season%3Acurrent%2Craid_progression`;
  const res = await axios(url)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data;
}

async function fetchPvPData(realm, character, bracket) {
  console.log("fetchPvPData called");
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data;
}

const client = new Client();
const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
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
      if (rbgData === "error") {
        msg.channel.send(
          "Oops! Looks like something went wrong. Make sure the information is correct."
        );
        return;
      }
      await msg.channel.send({
        embed: generateEmbed(
          {
            character: message.character,
            realm: message.realm,
            avatar: await fetchAvatar(message.realm, message.character),
            rating: rbgData.rating,
            weeklyData: rbgData.weekly_match_statistics,
            seasonData: rbgData.season_match_statistics,
          },
          "rbg"
        ),
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

  // ARENA
  // -------------------------------

  if (message.command === "!arena") {
    let player = message.character
      ? await UserModel.find({
          id: msg.author.id,
          character: message.character,
        })
      : await UserModel.find({ id: msg.author.id });
    if (!player && !message.character) {
      msg.reply("No character registered");
    }
    if (player.length > 1) {
      msg.reply(
        `you have ${player.length} characters registered. Please use !arena <character name>`
      );
      return;
    }
    console.log(`making rbg request for ${player}`);
    const threes = await fetchPvPData(
      player[0].realm,
      player[0].character,
      "3v3"
    );
    if (threes === "error") {
      msg.channel.send(
        "Oops! Looks like something went wrong. Make sure the information is correct."
      );
      return;
    }
    const twos = await fetchPvPData(
      player[0].realm,
      player[0].character,
      "2v2"
    );
    await msg.channel.send({
      embed: generateEmbed(
        {
          character: player[0].character,
          realm: player[0].realm,
          avatar: await fetchAvatar(player[0].realm, player[0].character),
          two: {
            rating: twos.rating,
            weeklyData: twos.weekly_match_statistics,
            seasonData: twos.season_match_statistics,
          },
          three: {
            rating: threes.rating,
            weeklyData: threes.weekly_match_statistics,
            seasonData: threes.season_match_statistics,
          },
        },
        "arena"
      ),
    });
  }

  // HELP
  // -------------------------------

  if (message.command === "!help") {
    msg.channel.send(
      "\n__**!help:**__ lists all functions." +
        "\n__**!register <character name> <realm-name>:**__ register a character" +
        "\n__**!rbg:**__ returns rated battleground stats, if you have multiple characters registered you will need to use !rbg <character name>" +
        "\n__**!arena:**__ returns arena stats, if you have multiple characters registered you will need to use !arena <character name>" +
        "\n__**!search:**__ returns a characters rating, format: !search <character name> <realm-name>" +
        "\n__**!remove <character name>:**__ removed a character registered to you" +
        "\n__**!characters:**__ lists all registered characters"
    );
  }

  // REMOVE
  // -------------------------------

  if (message.command === "!remove") {
    if (!message.character) {
      msg.reply(
        "Removal information incorrect, format: !remove <character name>"
      );
    }
    const player = await UserModel.findOne({
      id: msg.author.id,
      character: message.character,
    });
    if (!player) {
      msg.reply("No character registered");
    }
    console.log(`making rbg request for ${player}`);
    await UserModel.deleteOne(player);
    msg.reply(
      `${capitalize(player.character)} - ${formatRealmName(
        player.realm
      )} removed successfully!`
    );
  }

  if (message.command === "!characters") {
    const characters = await UserModel.find({ id: msg.author.id });
    if (characters.length === 0) {
      msg.reply("No characters registered");
    }
    let characterData = [];
    for (character of characters) {
      const charData = await fetchCharacterDetails(
        character.realm,
        character.character
      );
      if (charData === "error") {
        msg.reply("Oops! Looks like something went wrong.");
        return;
      }
      characterData.push({
        character: character.character,
        realm: character.realm,
        race: charData.playable_race.id,
        spec: charData.active_spec.id,
        class: charData.playable_class.id,
      });
    }
    msg.channel.send({ embed: generateEmbed(characterData, "characters") });
  }

  // RBG
  // -------------------------------

  if (message.command === "!rbg") {
    const player = message.character
      ? await UserModel.findOne({
          id: msg.author.id,
          character: message.character,
        })
      : await UserModel.find({ id: msg.author.id });
    if (!player && !message.character) {
      msg.reply("No character registered");
    }
    if (player.length > 1) {
      msg.reply(
        `you have ${player.length} characters registered. Please use !rbg <character name>`
      );
      return;
    }
    console.log(`making rbg request for ${player[0]}`);

    const rbgData = await fetchPvPData(
      player[0].realm,
      player[0].character,
      "rbg"
    );
    if (rbgData === "error") {
      msg.channel.send(
        "Oops! Looks like something went wrong. Make sure the information is correct."
      );
      return;
    }
    await msg.channel.send({
      embed: generateEmbed(
        {
          character: player[0].character,
          realm: player[0].realm,
          avatar: await fetchAvatar(player[0].realm, player[0].character),
          rating: rbgData.rating,
          weeklyData: rbgData.weekly_match_statistics,
          seasonData: rbgData.season_match_statistics,
        },
        "rbg"
      ),
    });
  }

  if (message.command === "!rio") {
    const player = message.character
      ? await UserModel.find({
          id: msg.author.id,
          character: message.character,
        })
      : await UserModel.find({ id: msg.author.id });
    if (!player && !message.character) {
      msg.reply("No character registered");
    }
    if (player.length > 1) {
      msg.reply(
        `you have ${player.length} characters registered. Please use !rio <character name>`
      );
      return;
    }
    console.log(`making rio request for ${player[0]}`);

    const rioData = await fetchRio(player[0].realm, player[0].character);

    await msg.channel.send({
      embed: generateEmbed(
        {
          character: player[0].character,
          realm: player[0].realm,
          avatar: rioData.thumbnail_url,
          score: rioData.mythic_plus_scores_by_season[0].scores.all.toString(),
          raid: rioData.raid_progression["castle-nathria"].summary,
        },
        "rio"
      ),
    });
  }
});

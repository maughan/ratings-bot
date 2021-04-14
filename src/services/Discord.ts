import { Message } from "discord.js";
import {
  Class,
  Embeds,
  mapClass,
  PvPBracketStats,
  Race,
  Races,
  Spec,
  Specs,
} from "../utils/interfaces";
import { capitalize, formatMessage, formatRealmName } from "../utils/helpers";
import {
  fetchAvatar,
  fetchCharacter,
  fetchPvPData,
  fetchRio,
} from "../utils/hooks";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  UserModel,
} from "../models/user";

interface EmbedData {
  character: string;
  realm: string;
  avatar?: string;
  data: {
    score?: string;
    raid?: string;
    rating?: number;
    weeklyData?: PvPBracketStats;
    seasonData?: PvPBracketStats;
    race?: Races;
    spec?: Specs;
    playableClass?: Class;
    two?: {
      rating: number;
      weeklyData: PvPBracketStats;
      seasonData: PvPBracketStats;
    };
    three?: {
      rating: number;
      weeklyData: PvPBracketStats;
      seasonData: PvPBracketStats;
    };
  };
}

const defaultEmbed = {
  color: 0x0099ff,
  timestamp: new Date(),
  footer: {
    text: "!rating - maughan",
    icon_url:
      "https://avatars.githubusercontent.com/u/40720420?s=460&u=988adec866a594eaa04d45c39ca090d1dbe6564d&v=4",
  },
};

function generateContent(data: EmbedData[], type: Embeds) {
  return {
    title:
      type === Embeds.CHARACTERS
        ? "Your registered characters:"
        : capitalize(data[0].character) +
          " - " +
          formatRealmName(data[0].realm),
    url:
      type !== Embeds.CHARACTERS
        ? `https://worldofwarcraft.com/en-gb/character/eu/${data[0].realm}/${data[0].character}`
        : undefined,
    thumbnail: type !== Embeds.CHARACTERS ? { url: data[0].avatar } : undefined,
    fields: generateEmbedFields(data, type),
  };
}

function generateEmbedFields(data: EmbedData[], type: Embeds) {
  return type === Embeds.RGB
    ? [
        {
          name: "Rated Battlegrounds",
          value: data[0].data.rating,
        },
        {
          name: "Week",
          value:
            "Won: " +
            data[0].data.weeklyData?.won +
            " - Lost: " +
            data[0].data.weeklyData?.lost,
          inline: true,
        },
        {
          name: "Season",
          value:
            "Won: " +
            data[0].data.seasonData?.won +
            " - Lost: " +
            data[0].data.seasonData?.lost,
          inline: true,
        },
      ]
    : type === Embeds.ARENA
    ? [
        {
          name: "2v2",
          value: data[0].data.two?.rating,
          inline: true,
        },
        {
          name: "Week",
          value:
            "Won: " +
            data[0].data.two?.weeklyData.won +
            " - Lost: " +
            data[0].data.two?.weeklyData.lost,
          inline: true,
        },
        {
          name: "Season",
          value:
            "Won: " +
            data[0].data.two?.seasonData.won +
            " - Lost: " +
            data[0].data.two?.seasonData.lost,
          inline: true,
        },
        {
          name: "3v3",
          value: data[0].data.three?.rating,
          inline: true,
        },
        {
          name: "Week",
          value:
            "Won: " +
            data[0].data.three?.weeklyData.won +
            " - Lost: " +
            data[0].data.three?.weeklyData.lost,
          inline: true,
        },
        {
          name: "Season",
          value:
            "Won: " +
            data[0].data.three?.seasonData.won +
            " - Lost: " +
            data[0].data.three?.seasonData.lost,
          inline: true,
        },
      ]
    : type === Embeds.RIO
    ? [
        {
          name: "Raider.io score",
          value: data[0].data.score,
          inline: true,
        },
        {
          name: "Raid progress",
          value: data[0].data.raid,
          inline: true,
        },
      ]
    : data.map((charData: EmbedData) => {
        const { character, realm } = charData;
        const { race, spec, playableClass } = charData.data;
        return {
          name: `${capitalize(character)} - ${formatRealmName(realm)}`,
          value: `${race} ${spec} ${playableClass}`,
        };
      });
}

export async function handle(message: Message) {
  const { command, realm, character } = formatMessage(message.content);

  // SEARCH
  // -------------------------------

  if (command === "!search") {
    if (!character || !realm) {
      channelMessage(
        message,
        "Search information incorrect. Format: !search <character name> <realm-name>"
      );
    } else {
      const {
        rating,
        weekly_match_statistics,
        season_match_statistics,
      } = await fetchPvPData(message, {
        realm,
        character,
        bracket: "rbg",
      });

      embed(
        message,
        [
          {
            character,
            realm,
            avatar: await fetchAvatar(message, {
              realm,
              character,
            }),
            data: {
              rating,
              weeklyData: weekly_match_statistics,
              seasonData: season_match_statistics,
            },
          },
        ],
        Embeds.RGB
      );
    }
  }

  // REGISTER
  // -------------------------------

  if (command === "!register") {
    if (!character || !realm) {
      channelMessage(
        message,
        "Registration information incorrect. Format: !search <character name> <realm-name>"
      );
    } else {
      await createUser(message, character, realm);

      reply(
        message,
        `character registered successfully: ${capitalize(
          character
        )} - ${formatRealmName(realm)}`
      );
    }
  }

  // ARENA
  // -------------------------------

  if (command === "!arena") {
    const user = await getUser(message, character);

    console.log(`making rbg request for ${user}`);

    const threes = await fetchPvPData(message, {
      realm: user.realm,
      character: user.character,
      bracket: "3v3",
    });

    const twos = await fetchPvPData(message, {
      realm: user.realm,
      character: user.character,
      bracket: "2v2",
    });

    embed(
      message,
      [
        {
          character: user.character,
          realm: user.realm,
          avatar: await fetchAvatar(message, {
            realm: user.realm,
            character: user.character,
          }),

          data: {
            two: {
              rating: twos ? twos.rating : 0,
              weeklyData: twos
                ? twos.weekly_match_statistics
                : { played: 0, won: 0, lost: 0 },
              seasonData: twos
                ? twos.season_match_statistics
                : { played: 0, won: 0, lost: 0 },
            },
            three: {
              rating: threes ? threes.rating : 0,
              weeklyData: threes
                ? threes.weekly_match_statistics
                : { played: 0, won: 0, lost: 0 },
              seasonData: threes
                ? threes.season_match_statistics
                : { played: 0, won: 0, lost: 0 },
            },
          },
        },
      ],
      Embeds.ARENA
    );
  }

  // HELP
  // -------------------------------

  if (command === "!help") {
    channelMessage(
      message,
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

  if (command === "!remove") {
    if (!character) {
      reply(
        message,
        "Removal information incorrect, format: !remove <character name>"
      );
    }

    const user = await deleteUser(message, character);

    reply(
      message,
      `${capitalize(user.character)} - ${formatRealmName(
        user.realm
      )} removed successfully!`
    );
  }

  if (command === "!characters") {
    const characters = await getUsers(message);

    if (characters.length === 0) {
      reply(message, "No characters registered");
    }

    let characterData: EmbedData[] = [];

    for (let char of characters) {
      const { realm, character } = char;

      const charData = await fetchCharacter(message, {
        realm,
        character,
      });

      characterData.push({
        character,
        realm,
        data: {
          race: Race[charData.playable_race.id],
          spec: Spec[charData.active_spec.id],
          playableClass: mapClass(charData.playable_class.id),
        },
      });
    }

    embed(message, characterData, Embeds.CHARACTERS);
  }

  // RBG
  // -------------------------------

  if (command === "!rbg") {
    const user = await getUser(message, character);

    console.log(`making rbg request for ${user}`);

    const rbgData = await fetchPvPData(message, {
      realm: user.realm,
      character: user.character,
      bracket: "rbg",
    });

    embed(
      message,
      [
        {
          character: user.character,
          realm: user.realm,
          avatar: await fetchAvatar(message, {
            realm: user.realm,
            character: user.character,
          }),
          data: {
            rating: rbgData.rating,
            weeklyData: rbgData.weekly_match_statistics,
            seasonData: rbgData.season_match_statistics,
          },
        },
      ],
      Embeds.RGB
    );
  }

  if (command === "!rio") {
    const user = await getUser(message, character);

    console.log(`making rio request for ${user}`);

    const rioData = await fetchRio(message, {
      realm,
      character,
    });

    embed(
      message,
      [
        {
          character: user.character,
          realm: user.realm,
          avatar: rioData.thumbnail_url,
          data: {
            score: rioData.mythic_plus_scores_by_season[0].scores.all.toString(),
            raid: rioData.raid_progression["castle-nathria"].summary,
          },
        },
      ],
      Embeds.RIO
    );
  }
}

export function reply(message: Message, response: string) {
  message.reply(response);
}

export function channelMessage(message: Message, response: string) {
  message.channel.send(response);
}

export function embed(message: Message, data: EmbedData[], type: Embeds) {
  message.channel.send({
    embed: { ...defaultEmbed, ...generateContent(data, type) },
  });
}

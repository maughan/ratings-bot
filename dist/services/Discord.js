"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embed = exports.channelMessage = exports.reply = exports.handle = void 0;
const interfaces_1 = require("../utils/interfaces");
const helpers_1 = require("../utils/helpers");
const hooks_1 = require("../utils/hooks");
const user_1 = require("../models/user");
const defaultEmbed = {
    color: 0x0099ff,
    timestamp: new Date(),
    footer: {
        text: "!rating - maughan",
        icon_url: "https://avatars.githubusercontent.com/u/40720420?s=460&u=988adec866a594eaa04d45c39ca090d1dbe6564d&v=4",
    },
};
function generateContent(data, type) {
    return {
        title: type !== interfaces_1.Embeds.CHARACTERS
            ? "Your registered characters:"
            : helpers_1.capitalize(data[0].character) +
                " - " +
                helpers_1.formatRealmName(data[0].realm),
        url: type !== interfaces_1.Embeds.CHARACTERS
            ? "https://worldofwarcraft.com/en-gb/character/eu/${data[0].realm}/${data[0].character}"
            : undefined,
        thumbnail: type !== interfaces_1.Embeds.CHARACTERS ? { url: data[0].avatar } : undefined,
        fields: generateEmbedFields(data, type),
    };
}
function generateEmbedFields(data, type) {
    return type === interfaces_1.Embeds.RGB
        ? [
            {
                name: "Rated Battlegrounds",
                value: data[0].data.rating,
            },
            {
                name: "Week",
                value: "Won: " +
                    data[0].data.weeklyData?.won +
                    " - Lost: " +
                    data[0].data.weeklyData?.lost,
                inline: true,
            },
            {
                name: "Season",
                value: "Won: " +
                    data[0].data.seasonData?.won +
                    " - Lost: " +
                    data[0].data.seasonData?.lost,
                inline: true,
            },
        ]
        : type === interfaces_1.Embeds.ARENA
            ? [
                {
                    name: "2v2",
                    value: data[0].data.two?.rating,
                    inline: true,
                },
                {
                    name: "Week",
                    value: "Won: " +
                        data[0].data.two?.weeklyData.won +
                        " - Lost: " +
                        data[0].data.two?.weeklyData.lost,
                    inline: true,
                },
                {
                    name: "Season",
                    value: "Won: " +
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
                    value: "Won: " +
                        data[0].data.three?.weeklyData.won +
                        " - Lost: " +
                        data[0].data.three?.weeklyData.lost,
                    inline: true,
                },
                {
                    name: "Season",
                    value: "Won: " +
                        data[0].data.three?.seasonData.won +
                        " - Lost: " +
                        data[0].data.three?.seasonData.lost,
                    inline: true,
                },
            ]
            : type === interfaces_1.Embeds.RIO
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
                : data.map((charData) => {
                    const { character, realm } = charData;
                    const { race, spec, playableClass } = charData.data;
                    return {
                        name: `${helpers_1.capitalize(character)} - ${helpers_1.formatRealmName(realm)}`,
                        value: `${race} ${spec} ${playableClass}`,
                    };
                });
}
async function handle(message) {
    const { command, realm, character } = helpers_1.formatMessage(message.content);
    // SEARCH
    // -------------------------------
    if (command === "!search") {
        if (!character || !realm) {
            channelMessage(message, "Search information incorrect. Format: !search <character name> <realm-name>");
        }
        else {
            const { rating, weekly_match_statistics, season_match_statistics, } = await hooks_1.fetchPvPData(message, {
                realm,
                character,
                bracket: "rbg",
            });
            embed(message, [
                {
                    character,
                    realm,
                    avatar: await hooks_1.fetchAvatar(message, { realm, character }),
                    data: {
                        rating,
                        weeklyData: weekly_match_statistics,
                        seasonData: season_match_statistics,
                    },
                },
            ], interfaces_1.Embeds.RGB);
        }
    }
    // REGISTER
    // -------------------------------
    if (command === "!register") {
        if (!character || !realm) {
            channelMessage(message, "Registration information incorrect. Format: !search <character name> <realm-name>");
        }
        else {
            await user_1.createUser(message, character, realm);
            reply(message, `character registered successfully: ${helpers_1.capitalize(character)} - ${helpers_1.formatRealmName(realm)}`);
        }
    }
    // ARENA
    // -------------------------------
    if (command === "!arena") {
        const user = await user_1.getUser(message, character);
        console.log(`making rbg request for ${user}`);
        const threes = await hooks_1.fetchPvPData(message, {
            realm,
            character,
            bracket: "3v3",
        });
        const twos = await hooks_1.fetchPvPData(message, {
            realm,
            character,
            bracket: "2v2",
        });
        if (!threes && !twos) {
            message.channel.send("You no arena data yet!");
        }
        embed(message, [
            {
                character,
                realm,
                avatar: await hooks_1.fetchAvatar(message, {
                    realm,
                    character,
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
        ], interfaces_1.Embeds.ARENA);
    }
    // HELP
    // -------------------------------
    if (command === "!help") {
        channelMessage(message, "\n__**!help:**__ lists all functions." +
            "\n__**!register <character name> <realm-name>:**__ register a character" +
            "\n__**!rbg:**__ returns rated battleground stats, if you have multiple characters registered you will need to use !rbg <character name>" +
            "\n__**!arena:**__ returns arena stats, if you have multiple characters registered you will need to use !arena <character name>" +
            "\n__**!search:**__ returns a characters rating, format: !search <character name> <realm-name>" +
            "\n__**!remove <character name>:**__ removed a character registered to you" +
            "\n__**!characters:**__ lists all registered characters");
    }
    // REMOVE
    // -------------------------------
    if (command === "!remove") {
        if (!character) {
            reply(message, "Removal information incorrect, format: !remove <character name>");
        }
        const user = await user_1.deleteUser(message, character);
        reply(message, `${helpers_1.capitalize(user.character)} - ${helpers_1.formatRealmName(user.realm)} removed successfully!`);
    }
    if (command === "!characters") {
        const characters = await user_1.getUsers(message);
        if (characters.length === 0) {
            reply(message, "No characters registered");
        }
        let characterData = [];
        for (let char of characters) {
            const { realm, character } = char;
            const charData = await hooks_1.fetchCharacter(message, {
                realm,
                character,
            });
            characterData.push({
                character,
                realm,
                data: {
                    race: interfaces_1.Race[charData.playable_race.id],
                    spec: interfaces_1.Spec[charData.active_spec.id],
                    playableClass: interfaces_1.mapClass(charData.playable_class.id),
                },
            });
        }
        embed(message, characterData, interfaces_1.Embeds.CHARACTERS);
    }
    // RBG
    // -------------------------------
    if (command === "!rbg") {
        const user = await user_1.getUser(message, character);
        console.log(`making rbg request for ${user}`);
        const rbgData = await hooks_1.fetchPvPData(message, {
            realm,
            character: character,
            bracket: "rbg",
        });
        embed(message, [
            {
                character,
                realm,
                avatar: await hooks_1.fetchAvatar(message, {
                    realm,
                    character,
                }),
                data: {
                    rating: rbgData.rating,
                    weeklyData: rbgData.weekly_match_statistics,
                    seasonData: rbgData.season_match_statistics,
                },
            },
        ], interfaces_1.Embeds.RGB);
    }
    if (command === "!rio") {
        const user = await user_1.getUser(message, character);
        console.log(`making rio request for ${user}`);
        const rioData = await hooks_1.fetchRio(message, {
            realm,
            character,
        });
        embed(message, [
            {
                character,
                realm,
                avatar: rioData.thumbnail_url,
                data: {
                    score: rioData.mythic_plus_scores_by_season[0].scores.all.toString(),
                    raid: rioData.raid_progression["castle-nathria"].summary,
                },
            },
        ], interfaces_1.Embeds.RIO);
    }
}
exports.handle = handle;
function reply(message, response) {
    message.reply(response);
}
exports.reply = reply;
function channelMessage(message, response) {
    message.channel.send(response);
}
exports.channelMessage = channelMessage;
function embed(message, data, type) {
    message.channel.send({
        embed: { ...defaultEmbed, ...generateContent(data, type) },
    });
}
exports.embed = embed;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRio = exports.fetchAvatar = exports.fetchPvPData = exports.fetchCharacter = void 0;
const api_1 = require("../modules/api");
async function fetchCharacter(message, data) {
    console.log(`fetchCharacter called for ${data.character} - ${data.realm}`);
    return await api_1.API(message, `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/appearance?namespace=profile-eu&locale=en_EU&access_token=`);
}
exports.fetchCharacter = fetchCharacter;
async function fetchPvPData(message, data) {
    console.log(`fetchPvPData called for ${data.character} - ${data.realm}`);
    const res = await api_1.API(message, `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/pvp-bracket/${data.bracket}?namespace=profile-eu&locale=en_EU&access_token=`);
    return res;
}
exports.fetchPvPData = fetchPvPData;
async function fetchAvatar(message, data) {
    console.log(`fetchAvatar called for ${data.character} - ${data.realm}`);
    const res = await api_1.API(message, `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/character-media?namespace=profile-eu&locale=en_EU&access_token=`);
    return res.assets[0].url;
}
exports.fetchAvatar = fetchAvatar;
async function fetchRio(message, data) {
    console.log(`fetchRio called for ${data.character} - ${data.realm}`);
    return await api_1.API(message, `https://raider.io/api/v1/characters/profile?region=eu&realm=${data.realm}&name=${data.character}&fields=mythic_plus_scores_by_season%3Acurrent%2Craid_progression`);
}
exports.fetchRio = fetchRio;

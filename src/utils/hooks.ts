import { Message } from "discord.js";
import { API } from "../modules/api";
import {
  CharacterAppearance,
  CharacterPvPBracket,
  RaiderIOCharacter,
  URLBracket,
} from "./interfaces";

export async function fetchCharacter(
  message: Message,
  data: { realm: string; character: string }
): Promise<CharacterAppearance> {
  console.log(`fetchCharacter called for ${data.character} - ${data.realm}`);

  return await API(
    message,
    `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/appearance?namespace=profile-eu&locale=en_EU&access_token=`
  );
}

export async function fetchPvPData(
  message: Message,
  data: {
    realm: string;
    character: string;
    bracket: URLBracket;
  }
): Promise<CharacterPvPBracket> {
  console.log(`fetchPvPData called for ${data.character} - ${data.realm}`);

  const res = await API(
    message,
    `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/pvp-bracket/${data.bracket}?namespace=profile-eu&locale=en_EU&access_token=`
  );

  return res;
}

export async function fetchAvatar(
  message: Message,
  data: { realm: string; character: string }
): Promise<string> {
  console.log(`fetchAvatar called for ${data.character} - ${data.realm}`);

  const res = await API(
    message,
    `https://eu.api.blizzard.com/profile/wow/character/${data.realm}/${data.character}/character-media?namespace=profile-eu&locale=en_EU&access_token=`
  );

  return res.assets[0].value;
}

export async function fetchRio(
  message: Message,
  data: { realm: string; character: string }
): Promise<RaiderIOCharacter> {
  console.log(`fetchRio called for ${data.character} - ${data.realm}`);

  return await API(
    message,
    `https://raider.io/api/v1/characters/profile?region=eu&realm=${data.realm}&name=${data.character}&fields=mythic_plus_scores_by_season%3Acurrent%2Craid_progression`
  );
}

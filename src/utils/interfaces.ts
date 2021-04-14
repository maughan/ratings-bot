interface Character {
  key: {
    href: string;
  };
  name: string;
  id: number;
  realm: CharacterAppearanceSlug;
}

interface CharacterAppearanceSlug {
  key: {
    href: string;
  };
  name: string | null;
  id: number;
  slug?: string;
}

interface CharacterAppearanceColor {
  id: number;
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

interface CharacterApperanceCrestData {
  id: string;
  media: {
    key: {
      href: string;
    };
    id: number;
  };
  color: CharacterAppearanceColor;
}

interface CharacterAppearanceItem {
  id: number;
  slot: {
    type: string;
    name: null | string;
  };
  enchant: number;
  item_appearance_modifier_id: number;
  internal_slot_id: number;
  subclass: number;
}

interface CharacterAppearanceCutomization {
  option: {
    name: null | string;
    id: number;
  };
  choice: {
    id: number;
    display_order: number;
    name?: null | string;
  };
}

export interface CharacterAppearance {
  _links: {
    self: {
      href: string;
    };
  };
  character: Character;
  playable_race: CharacterAppearanceSlug;
  playable_class: CharacterAppearanceSlug;
  active_spec: CharacterAppearanceSlug;
  gender: {
    type: string;
    name: null;
  };
  faction: {
    type: string;
    name: null;
  };
  guild_crest: {
    emblem: CharacterApperanceCrestData;
    border: CharacterApperanceCrestData;
    background: {
      color: CharacterAppearanceColor;
    };
  };
  items: CharacterAppearanceItem[];
  customizations: CharacterAppearanceCutomization[];
}

export interface CharacterMedia {
  key: string;
  value: string;
}

enum CharacterFaction {
  ALLIANCE = "ALLIANCE",
  HORDE = "HORDE",
}

export type URLBracket = "2v2" | "3v3" | "rbg";

type PvPBracket = "ARENA_2v2" | "ARENA_3v3" | "BATTLEGROUNDS";

export interface CharacterPvPBracket {
  _links: {
    self: {
      href: string;
    };
  };
  character: Character;
  faction: {
    type: CharacterFaction;
    name: null | string;
  };
  bracket: {
    id: number;
    type: PvPBracket;
  };
  rating: number;
  season: {
    key: {
      href: string;
    };
    id: number;
  };
  tier: {
    key: {
      href: string;
    };
    id: number;
  };
  season_match_statistics: PvPBracketStats;
  weekly_match_statistics: PvPBracketStats;
}

export interface PvPBracketStats {
  played: number;
  won: number;
  lost: number;
}

enum Regions {
  EU = "eu",
  US = "us",
  TW = "tw",
  KR = "kr",
  CR = "cr",
}

export enum Races {
  HUMAN = "Human",
  ORC = "Orc",
  DWARF = "Dwarf",
  NIGHTELF = "Night Elf",
  UNDEAD = "Undead",
  TAUREN = "Tauren",
  GNOME = "Gnome",
  TROLL = "Troll",
  GOBLIN = "Goblin",
  BLOODELF = "Blood Elf",
  DRAENEI = "Draenei",
  WORGEN = "Worgen",
  PANDAREN = "Pandaren",
  NIGHTBORN = "Nightborne",
  HIGHMOUNTAINTAUREN = "Highmountain Tauren",
  VOIDELF = "Void Elf",
  LIGHTFORGEDDRAENEI = "Lightforged Draenei",
  ZANDALARITROLL = "Zandalari Troll",
  KULLTIRAN = "Kul Tiran",
  DARKIRONDWARF = "Dark Iron Dwarf",
  VULPERA = "Vulpera",
  MAGHARORC = "Mag'har Orc",
  MECHAGNOME = "Mechagnome",
}

export const Race: Record<number, Races> = {
  1: Races.HUMAN,
  2: Races.ORC,
  3: Races.DWARF,
  4: Races.NIGHTELF,
  5: Races.UNDEAD,
  6: Races.TAUREN,
  7: Races.GNOME,
  8: Races.TROLL,
  9: Races.GOBLIN,
  10: Races.BLOODELF,
  11: Races.DRAENEI,
  22: Races.WORGEN,
  24: Races.PANDAREN,
  25: Races.PANDAREN,
  26: Races.PANDAREN,
  27: Races.NIGHTBORN,
  28: Races.HIGHMOUNTAINTAUREN,
  29: Races.VOIDELF,
  30: Races.LIGHTFORGEDDRAENEI,
  31: Races.ZANDALARITROLL,
  32: Races.KULLTIRAN,
  34: Races.DARKIRONDWARF,
  35: Races.VULPERA,
  36: Races.MAGHARORC,
  37: Races.MECHAGNOME,
};

export enum Class {
  WARRIOR = "Warrior",
  PALADIN = "Paladin",
  HUNTER = "Hunter",
  ROGUE = "Rogue",
  PRIEST = "Priest",
  DEATHKNIGHT = "Death Knight",
  SHAMAN = "Shaman",
  MAGE = "Mage",
  WARLOCK = "Warlock",
  MONK = "Monk",
  DRUID = "Druid",
  DEMONHUNTER = "Demon Hunter",
}

export function mapClass(classID: number): Class {
  return Object.values(Class)[classID];
}

export enum Specs {
  ARCANE = "Arcane",
  FIRE = "Fire",
  FROST = "Frost",
  HOLY = "Holy",
  PROTECTION = "Protection",
  RETRIBUTION = "Retribution",
  ARMS = "Arms",
  FURY = "Fury",
  BALANCE = "Balance",
  FERAL = "Feral",
  GUARDIAN = "Guardian",
  RESTORATION = "Restoration",
  BLOOD = "Blood",
  UNHOLY = "Unholy",
  BEASTMASTERY = "Beast Mastery",
  MARKSMANSHIP = "Marksmanship",
  SURVIVAL = "Survival",
  DISCIPLINE = "Discipline",
  SHADOW = "Shadow",
  ASSASSINATION = "Assassination",
  OUTLAW = "Outlaw",
  SUBTLETY = "Subtlety",
  ELEMENTAL = "Elemental",
  ENHANCEMENT = "Enhancement",
  AFFLICTION = "Affliction",
  DEMONOLOGY = "Demonology",
  DESTRUCTION = "Destruction",
  BREWMASTER = "Brewmaster",
  WINDWALKER = "Windwalker",
  MISTWEAVER = "Mistweaver",
  HAVOC = "Havoc",
  VENGEANCE = "Vengeance",
}

export const Spec: Record<number, Specs> = {
  62: Specs.ARCANE,
  63: Specs.FIRE,
  64: Specs.FROST,
  65: Specs.HOLY,
  66: Specs.PROTECTION,
  70: Specs.RETRIBUTION,
  71: Specs.ARMS,
  72: Specs.FURY,
  73: Specs.PROTECTION,
  102: Specs.BALANCE,
  103: Specs.FERAL,
  104: Specs.GUARDIAN,
  105: Specs.RESTORATION,
  250: Specs.BLOOD,
  251: Specs.FROST,
  252: Specs.UNHOLY,
  253: Specs.BEASTMASTERY,
  254: Specs.MARKSMANSHIP,
  255: Specs.SURVIVAL,
  256: Specs.DISCIPLINE,
  257: Specs.HOLY,
  258: Specs.SHADOW,
  259: Specs.ASSASSINATION,
  260: Specs.OUTLAW,
  261: Specs.SUBTLETY,
  262: Specs.ELEMENTAL,
  263: Specs.ENHANCEMENT,
  264: Specs.RESTORATION,
  265: Specs.AFFLICTION,
  266: Specs.DEMONOLOGY,
  267: Specs.DESTRUCTION,
  268: Specs.BREWMASTER,
  269: Specs.WINDWALKER,
  270: Specs.MISTWEAVER,
  577: Specs.HAVOC,
  581: Specs.VENGEANCE,
};

enum Role {
  DPS = "DPS",
  TANK = "TANK",
  HEALER = "HEALER",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

enum Faction {
  ALLIANCE = "alliance",
  HORDE = "horde",
}

interface SeasonScores {
  season: string;
  scores: {
    all: number;
    dps: number;
    healer?: number;
    tank?: number;
    spec_0: number;
    spec_1: number;
    spec_2?: number;
    spec_3?: number;
  };
}

interface RaidProgression {
  [key: string]: {
    summary: string;
    total_bosses: number;
    normal_bosses_killed: number;
    heroic_bosses_killed: number;
    mythic_bosses_killed: number;
  };
}

export interface RaiderIOCharacter {
  name: string;
  Races: Races;
  class: Class;
  active_spec_name: Specs;
  active_spec_role: Role;
  gender: Gender;
  faction: Faction;
  achievement_point: number;
  honorable_kills: number;
  thumbnail_url: string;
  region: Regions;
  realm: string;
  last_crawled_at: string;
  profile_url: string;
  profile_banner: string;
  mythic_plus_scores_by_season: SeasonScores[];
  raid_progression: RaidProgression;
}

export interface CharacterData {
  character: string;
  realm: string;
  data: {
    race: Races;
    spec: Specs;
    playableClass: Class;
  };
}

export enum Embeds {
  RGB = "rgb",
  ARENA = "arena",
  CHARACTERS = "characters",
  RIO = "rio",
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embeds = exports.Gender = exports.Spec = exports.Specs = exports.mapClass = exports.Class = exports.Race = exports.Races = void 0;
var CharacterFaction;
(function (CharacterFaction) {
    CharacterFaction["ALLIANCE"] = "ALLIANCE";
    CharacterFaction["HORDE"] = "HORDE";
})(CharacterFaction || (CharacterFaction = {}));
var Regions;
(function (Regions) {
    Regions["EU"] = "eu";
    Regions["US"] = "us";
    Regions["TW"] = "tw";
    Regions["KR"] = "kr";
    Regions["CR"] = "cr";
})(Regions || (Regions = {}));
var Races;
(function (Races) {
    Races["HUMAN"] = "Human";
    Races["ORC"] = "Orc";
    Races["DWARF"] = "Dwarf";
    Races["NIGHTELF"] = "Night Elf";
    Races["UNDEAD"] = "Undead";
    Races["TAUREN"] = "Tauren";
    Races["GNOME"] = "Gnome";
    Races["TROLL"] = "Troll";
    Races["GOBLIN"] = "Goblin";
    Races["BLOODELF"] = "Blood Elf";
    Races["DRAENEI"] = "Draenei";
    Races["WORGEN"] = "Worgen";
    Races["PANDAREN"] = "Pandaren";
    Races["NIGHTBORN"] = "Nightborne";
    Races["HIGHMOUNTAINTAUREN"] = "Highmountain Tauren";
    Races["VOIDELF"] = "Void Elf";
    Races["LIGHTFORGEDDRAENEI"] = "Lightforged Draenei";
    Races["ZANDALARITROLL"] = "Zandalari Troll";
    Races["KULLTIRAN"] = "Kul Tiran";
    Races["DARKIRONDWARF"] = "Dark Iron Dwarf";
    Races["VULPERA"] = "Vulpera";
    Races["MAGHARORC"] = "Mag'har Orc";
    Races["MECHAGNOME"] = "Mechagnome";
})(Races = exports.Races || (exports.Races = {}));
exports.Race = {
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
var Class;
(function (Class) {
    Class["WARRIOR"] = "Warrior";
    Class["PALADIN"] = "Paladin";
    Class["HUNTER"] = "Hunter";
    Class["ROGUE"] = "Rogue";
    Class["PRIEST"] = "Priest";
    Class["DEATHKNIGHT"] = "Death Knight";
    Class["SHAMAN"] = "Shaman";
    Class["MAGE"] = "Mage";
    Class["WARLOCK"] = "Warlock";
    Class["MONK"] = "Monk";
    Class["DRUID"] = "Druid";
    Class["DEMONHUNTER"] = "Demon Hunter";
})(Class = exports.Class || (exports.Class = {}));
function mapClass(classID) {
    return Object.values(Class)[classID];
}
exports.mapClass = mapClass;
var Specs;
(function (Specs) {
    Specs["ARCANE"] = "Arcane";
    Specs["FIRE"] = "Fire";
    Specs["FROST"] = "Frost";
    Specs["HOLY"] = "Holy";
    Specs["PROTECTION"] = "Protection";
    Specs["RETRIBUTION"] = "Retribution";
    Specs["ARMS"] = "Arms";
    Specs["FURY"] = "Fury";
    Specs["BALANCE"] = "Balance";
    Specs["FERAL"] = "Feral";
    Specs["GUARDIAN"] = "Guardian";
    Specs["RESTORATION"] = "Restoration";
    Specs["BLOOD"] = "Blood";
    Specs["UNHOLY"] = "Unholy";
    Specs["BEASTMASTERY"] = "Beast Mastery";
    Specs["MARKSMANSHIP"] = "Marksmanship";
    Specs["SURVIVAL"] = "Survival";
    Specs["DISCIPLINE"] = "Discipline";
    Specs["SHADOW"] = "Shadow";
    Specs["ASSASSINATION"] = "Assassination";
    Specs["OUTLAW"] = "Outlaw";
    Specs["SUBTLETY"] = "Subtlety";
    Specs["ELEMENTAL"] = "Elemental";
    Specs["ENHANCEMENT"] = "Enhancement";
    Specs["AFFLICTION"] = "Affliction";
    Specs["DEMONOLOGY"] = "Demonology";
    Specs["DESTRUCTION"] = "Destruction";
    Specs["BREWMASTER"] = "Brewmaster";
    Specs["WINDWALKER"] = "Windwalker";
    Specs["MISTWEAVER"] = "Mistweaver";
    Specs["HAVOC"] = "Havoc";
    Specs["VENGEANCE"] = "Vengeance";
})(Specs = exports.Specs || (exports.Specs = {}));
exports.Spec = {
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
var Role;
(function (Role) {
    Role["DPS"] = "DPS";
    Role["TANK"] = "TANK";
    Role["HEALER"] = "HEALER";
})(Role || (Role = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
var Faction;
(function (Faction) {
    Faction["ALLIANCE"] = "alliance";
    Faction["HORDE"] = "horde";
})(Faction || (Faction = {}));
var Embeds;
(function (Embeds) {
    Embeds["RGB"] = "rgb";
    Embeds["ARENA"] = "arena";
    Embeds["CHARACTERS"] = "characters";
    Embeds["RIO"] = "rio";
})(Embeds = exports.Embeds || (exports.Embeds = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = exports.formatRealmName = exports.capitalize = void 0;
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.capitalize = capitalize;
function formatRealmName(realm) {
    return realm
        .split("-")
        .map((word) => capitalize(word))
        .filter((char) => char !== "-")
        .join(" ");
}
exports.formatRealmName = formatRealmName;
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
exports.formatMessage = formatMessage;

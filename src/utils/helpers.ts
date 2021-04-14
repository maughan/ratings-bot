export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatRealmName(realm: string): string {
  return realm
    .split("-")
    .map((word) => capitalize(word))
    .filter((char) => char !== "-")
    .join(" ");
}

export function formatMessage(message: string) {
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

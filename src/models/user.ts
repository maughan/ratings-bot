import { Message } from "discord.js";
import mongoose, { Schema, Document } from "mongoose";
import { reply } from "../services/Discord";

export interface User extends Document {
  id: string;
  character: string;
  realm: string;
}

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
  realm: {
    type: String,
    required: true,
  },
});

export const UserModel = mongoose.model<User>("user", UserSchema);

export async function getUser(
  message: Message,
  character?: string
): Promise<User> {
  const users = await UserModel.find({ id: message.author.id });
  if (!users) {
    message.reply("No character registered.");
  }

  if (!character && users.length > 1) {
    message.reply(
      `you have ${users.length} characters registered. Please use !rbg <character name>`
    );
  }

  const user = character
    ? users.find((user) => user.character === character)
    : users[0];

  if (!user) {
    reply(message, "No character registered.");
  }

  return user!;
}

export async function getUsers(message: Message): Promise<User[]> {
  const users = await UserModel.find({ id: message.author.id });
  if (!users) {
    reply(message, "No character registered.");
  }
  return users;
}

export async function deleteUser(
  message: Message,
  character: string
): Promise<User> {
  const user = await UserModel.findOneAndDelete(
    { id: message.author.id, character },
    { returnOriginal: true }
  );
  if (!user) {
    reply(message, "No character registered.");
  }
  return user!;
}

export async function createUser(
  message: Message,
  character: string,
  realm: String
): Promise<void> {
  const user = new UserModel({ id: message.author.id, character, realm });
  await user.save();
}

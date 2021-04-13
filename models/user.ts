import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: string;
  character: string;
  realm: string;
}

const UserSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
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

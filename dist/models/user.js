"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.deleteUser = exports.getUsers = exports.getUser = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Discord_1 = require("../services/Discord");
const UserSchema = new mongoose_1.Schema({
    id: {
        type: mongoose_1.default.Types.ObjectId,
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
exports.UserModel = mongoose_1.default.model("user", UserSchema);
async function getUser(message, character) {
    const user = await exports.UserModel.find({ id: message.author.id });
    if (!user && !character) {
        message.reply("No character registered.");
    }
    if (user.length > 1) {
        message.reply(`you have ${user.length} characters registered. Please use !rbg <character name>`);
    }
    return user.find((user) => user.character === character);
}
exports.getUser = getUser;
async function getUsers(message) {
    const users = await exports.UserModel.find({ id: message.author.id });
    if (!users) {
        Discord_1.reply(message, "No character registered.");
    }
    return users;
}
exports.getUsers = getUsers;
async function deleteUser(message, character) {
    const user = await exports.UserModel.findOneAndDelete({ id: message.author.id, character }, { returnOriginal: true });
    if (!user) {
        Discord_1.reply(message, "No character registered.");
    }
    return user;
}
exports.deleteUser = deleteUser;
async function createUser(message, character, realm) {
    const user = new exports.UserModel({ id: message.author.id, character, realm });
    await user.save();
}
exports.createUser = createUser;

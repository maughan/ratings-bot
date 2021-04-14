"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const axios_1 = __importDefault(require("axios"));
exports.API = async (message, url) => {
    let ACCESS_TOKEN = "1";
    async function refreshToken() {
        console.log("refreshing token");
        const res = await axios_1.default({
            method: "post",
            url: "https://us.battle.net/oauth/token",
            headers: {
                Authorization: "Basic NmNhM2U3YjE2ZjI0NGI1YzkwNWNlOTg5NmIyNmQ5Nzg6U05wOVBVMGV0RmxiNTBPTk05WDI2YVpUZG0wMTZHSEw=",
                "content-type": "application/x-www-form-urlencoded",
            },
            data: "grant_type=client_credentials",
        })
            .then((res) => res)
            .catch((e) => console.log("error:" + e));
        if (res) {
            ACCESS_TOKEN = res.data.access_token;
        }
    }
    function handleError(error) {
        console.log(error.message, url);
        if (error.response?.status === 404) {
            return null;
        }
        message.channel.send("Oops! Something went wrong.");
    }
    return await axios_1.default(url + ACCESS_TOKEN)
        .then((res) => res.data)
        .catch(async (e) => e.response.status === 401
        ? await refreshToken().then(async () => await axios_1.default(url + ACCESS_TOKEN).then((res) => res.data))
        : handleError(e));
};

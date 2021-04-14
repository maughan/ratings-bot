import axios, { AxiosError } from "axios";
import { Message } from "discord.js";

let ACCESS_TOKEN = "1";

export const API = async (message: Message, url: string) => {
  console.log("request made @ ", url + ACCESS_TOKEN);
  async function refreshToken() {
    console.log("refreshing token");
    const res = await axios({
      method: "post",
      url: "https://us.battle.net/oauth/token",
      headers: {
        Authorization:
          "Basic NmNhM2U3YjE2ZjI0NGI1YzkwNWNlOTg5NmIyNmQ5Nzg6U05wOVBVMGV0RmxiNTBPTk05WDI2YVpUZG0wMTZHSEw=",
        "content-type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    })
      .then((res) => res)
      .catch((e) => console.log("error:" + e));
    if (res) {
      ACCESS_TOKEN = res.data.access_token;
      return res.data.access_token;
    }
  }

  function handleError(error: AxiosError) {
    console.log(error.message, url);
    if (error.response?.status === 404) {
      return null;
    }
    message.channel.send("Oops! Something went wrong.");
  }

  return await axios(url + ACCESS_TOKEN)
    .then((res) => res.data)
    .catch(async (e) =>
      e.response.status === 401
        ? await refreshToken().then(
            async (token) =>
              await axios(url + token)
                .then((res) => res.data)
                .catch((e) => handleError(e))
          )
        : e.response.status === 404
        ? null
        : handleError(e)
    );
};

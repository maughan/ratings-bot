import axios, { AxiosResponse } from "axios";

let ACCESS_TOKEN = "";

async function refreshToken(): Promise<void> {
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
  }
}

async function handleAuthentication(
  url: string
): Promise<AxiosResponse<any> | { data: string }> {
  await refreshToken();
  return await axios(url + ACCESS_TOKEN)
    .then((res) => res)
    .catch((e) => {
      console.log(e.message, url);
      return { data: "error" };
    });
}

async function fetchCharacterDetails(
  realm: string,
  character: string
): Promise<Record<string, string>> {
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/appearance?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data;
}

async function fetchPvPData(
  realm: string,
  character: string,
  bracket: string
): Promise<Record<string, string>> {
  console.log("fetchPvPData called");
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data;
}

async function fetchAvatar(realm: string, character: string): Promise<string> {
  const url = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/character-media?namespace=profile-eu&locale=en_EU&access_token=`;
  const res = await axios(url + ACCESS_TOKEN)
    .then(async (res) =>
      res.status === 401 ? await handleAuthentication(url) : res
    )
    .catch(async (e) =>
      e.response.status === 401
        ? await handleAuthentication(url)
        : { data: "error" }
    );

  return res.data.assets[0].value;
}

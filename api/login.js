const crypto = require("crypto");
const L = require("./_lib");

module.exports = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: L.CLIENT_ID,
      redirect_uri: L.BASE_URL + "/auth/callback",
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive",
      access_type: "offline",
      prompt: "consent",
      state,
    });
  L.send(res, 302, "", { Location: url, "Set-Cookie": L.setCookie("st", state, 600) });
};

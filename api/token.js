const L = require("./_lib");

module.exports = async (req, res) => {
  const json = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  try {
    const t = await L.tokenReq({
      refresh_token: L.dec(L.getCookie(req, "rt")),
      grant_type: "refresh_token",
    });
    if (!t.access_token) throw new Error("no token");
    L.send(res, 200, JSON.stringify({ access_token: t.access_token }), json);
  } catch (e) {
    L.send(res, 401, "{}", json);
  }
};

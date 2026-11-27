const L = require("./_lib");

module.exports = async (req, res) => {
  const q = new URL(req.url, "http://x").searchParams;
  if (!q.get("code") || q.get("state") !== L.getCookie(req, "st")) {
    return L.send(res, 400, "Lỗi đăng nhập", { "Content-Type": "text/plain; charset=utf-8" });
  }
  const t = await L.tokenReq({
    code: q.get("code"),
    grant_type: "authorization_code",
    redirect_uri: L.BASE_URL + "/auth/callback",
  });
  if (!t.refresh_token) {
    return L.send(res, 400, "Không nhận được refresh token", { "Content-Type": "text/plain; charset=utf-8" });
  }
  L.send(res, 302, "", {
    Location: "/",
    "Set-Cookie": [L.setCookie("rt", L.enc(t.refresh_token), 180 * 86400), L.setCookie("st", "", 0)],
  });
};

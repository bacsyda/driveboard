const crypto = require("crypto");
const { CLIENT_ID, CLIENT_SECRET, SESSION_SECRET } = process.env;
const BASE_URL = (process.env.BASE_URL || "").replace(/\/$/, "");
const KEY = crypto.createHash("sha256").update(SESSION_SECRET || "").digest();

const enc = (t) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const b = Buffer.concat([c.update(t, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), b]).toString("base64url");
};
const dec = (t) => {
  const b = Buffer.from(t, "base64url");
  const d = crypto.createDecipheriv("aes-256-gcm", KEY, b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
};
const getCookie = (req, name) => {
  const m = (req.headers.cookie || "").split(/;\s*/).find((x) => x.startsWith(name + "="));
  return m && m.slice(name.length + 1);
};
const setCookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` +
  (BASE_URL.startsWith("https") ? "; Secure" : "");
const tokenReq = (body) =>
  fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...body }),
  }).then((r) => r.json());
const send = (res, code, body, headers = {}) => {
  res.statusCode = code;
  for (const k in headers) res.setHeader(k, headers[k]);
  res.end(body);
};

module.exports = { CLIENT_ID, BASE_URL, enc, dec, getCookie, setCookie, tokenReq, send };

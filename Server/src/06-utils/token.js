import jwt from "jsonwebtoken";

const cookieSecure = process.env.COOKIE_SECURE === "true";

export const cookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: cookieSecure ? "None" : "Lax",
  path: "/",
};

export function setAccessTokenCookies(res, payload) {
  const access_Token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });

  res.cookie("access_Token", access_Token, {
    ...cookieOptions,
    maxAge: 60 * 1000,
  });

  return access_Token;
}

export function setRefreshTokenCookie(res, payload) {
  const refresh_Token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20h",
  });

  res.cookie("refresh_Token", refresh_Token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return refresh_Token;
}

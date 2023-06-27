import { Token } from "../models/tokens";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_PRIVATE_KEY } from "./secret";

const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = REFRESH_TOKEN_PRIVATE_KEY;

  return new Promise(async (resolve, reject) => {
    const token = await Token.findOne({ token: refreshToken });
    if (!token) return reject({ error: true, message: "invalid refresh token" });

    jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
      if (err) return reject({ error: true, message: "invalid refresh token" });
      resolve({
        tokenDetails,
        error: false,
        message: "valid refresh token"
      });
    });
  });
};

export default verifyRefreshToken;

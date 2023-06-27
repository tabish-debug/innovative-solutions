import jwt from "jsonwebtoken";
import { Token } from "../models/tokens";
import { IUser } from "../models/users";
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from "./secret";

const generateTokens = async (user: IUser) => {
  try {
    const { _id, roles } = user;
    const accessToken = jwt.sign({ _id, roles }, ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "14m" });
    const refreshToken = jwt.sign({ _id, roles }, REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: "30d" });

    await Token.findOneAndDelete({ userId: user._id });
    await Token.create({ userId: user._id, token: refreshToken });

    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};

export default generateTokens;

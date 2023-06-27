import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { refreshTokenBodyValidation } from "../utils/validationSchema";
import verifyRefreshToken from "../utils/verifyRefreshToken";
import { ACCESS_TOKEN_PRIVATE_KEY } from "../utils/secret";

export class RefreshController {
  public async newAccessToken(req: Request, res: Response, next: NextFunction) {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    try {
      const data: any = await verifyRefreshToken(req.body.refreshToken);
      const { tokenDetails } = data;
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "14m" });
      return res
        .status(200)
        .json({ error: false, accessToken, message: "accessToken created successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

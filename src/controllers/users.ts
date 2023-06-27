import { NextFunction, Request, Response } from "express";
import {
  logInBodyValidation,
  refreshTokenBodyValidation,
  signUpBodyValidation
} from "../utils/validationSchema";
import { User } from "../models/users";
import generateTokens from "../utils/generateTokens";
import { Token } from "../models/tokens";
import { getUserFromEmail, saveUser } from "../services/users";

export class UserController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = signUpBodyValidation(req.body);
      if (error) return res.status(400).json({ error: true, message: error.details[0].message });

      const { username, email, password } = req.body;

      const user = await getUserFromEmail(email);
      if (user)
        return res.status(409).json({ error: true, message: "user with this email already exist" });

      await saveUser({ username, email, password });

      return res.status(201).json({ error: false, message: "user created successfully" });
    } catch (error) {
      return res.status(500).json({ error: true, message: "internal server error" });
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    const { error } = logInBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    const { email, password } = req.body;

    const user: any = await getUserFromEmail(email);
    if (!user) {
      return res.status(401).json({ error: true, message: "invalid email or password" });
    }

    return user.passwordComparison(password, async (error: Error | null, isMatch: boolean) => {
      if (error) {
        return res.status(500).json({ error: true, message: "Internal server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ error: true, message: "invalid email or password" });
      }

      const { accessToken, refreshToken } = await generateTokens(user);

      return res
        .status(200)
        .json({ accessToken, refreshToken, error: false, message: "login successful" });
    });
  }

  public async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = refreshTokenBodyValidation(req.body);
      if (error) return res.status(400).json({ error: true, message: error.details[0].message });

      await Token.findOneAndDelete({ token: req.body.refreshToken });
      return res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    } catch (err) {
      return res.status(500).json({ error: true, message: "internal server error" });
    }
  }
}

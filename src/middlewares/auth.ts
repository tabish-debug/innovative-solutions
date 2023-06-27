import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_PRIVATE_KEY } from "../utils/secret";

function AuthorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  let authorization = req.headers && req.headers.authorization;

  if (!authorization) {
    return res.status(404).json({ error: true, message: "token for authorization not found" });
  }

  let token;
  let privateKey = ACCESS_TOKEN_PRIVATE_KEY;
  const parts = authorization.split(" ");
  if (parts.length != 2) {
    return res.status(401).json({ error: true, message: "invalid token" });
  }

  const [scheme, credentials] = parts;

  if (/^Bearer$/i.test(scheme)) {
    token = credentials;
  }

  if (!token) {
    return res.status(401).json({ error: true, message: "invalid token" });
  }

  jwt.verify(credentials, privateKey, (err, tokenDetails: any) => {
    if (err) {
      return res.status(401).json({ error: true, message: err.message });
    } else {
      req.body.userId = tokenDetails._id;
      return next();
    }
  });
}

export default AuthorizationMiddleware;

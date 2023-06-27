import { Response } from "express";

export interface refreshToken {
  refreshToken: string;
}

export type PasswordComparisonCallback = (error: Error | undefined, isMatch: boolean) => Response;

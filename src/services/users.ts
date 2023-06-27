import { PasswordComparisonCallback } from "src/interfaces/user";
import { User, IUser } from "../models/users";

export async function saveUser(user: Partial<IUser>): Promise<void> {
  await User.create(user);
}

export async function getUserFromEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}

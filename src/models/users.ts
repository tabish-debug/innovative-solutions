import { Document, Schema, Model, model, Error } from "mongoose";
import bcrypt from "bcrypt";
import { PasswordComparisonCallback } from "src/interfaces/user";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles?: Array<string>;
  createdAt?: Date;
  comparePassword: (password: string, callback: (err: Error, isMatch: boolean) => void) => void;
}

export const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "superuser"],
    default: ["user"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre<IUser>("save", function save(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err: Error | undefined, hash: string) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.passwordComparison = async function (
  userPassword: string,
  callback: PasswordComparisonCallback
) {
  bcrypt.compare(userPassword, this.password, (err: Error | undefined, isMatch: boolean) => {
    callback(err, isMatch);
  });
};

export const User: Model<IUser> = model<IUser>("User", userSchema);

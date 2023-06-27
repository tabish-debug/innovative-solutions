import { Document, Schema, Model, model } from "mongoose";

export interface IToken extends Document {
  userId: string;
  token: string;
  createdAt?: Date;
}

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400
  }
});

export const Token: Model<IToken> = model<IToken>("Token", tokenSchema);

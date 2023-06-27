import { Document, Schema, Model, model } from "mongoose";

export interface IComment extends Document {
  userId: string;
  movieId: string;
  comment: string;
  created_at: Date;
}

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  movieId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Comment: Model<IComment> = model<IComment>("Comment", commentSchema);

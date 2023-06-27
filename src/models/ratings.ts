import { Document, Schema, Model, model } from "mongoose";

export interface IRating extends Document {
  userId: string;
  movieId: string;
  rate: number;
  created_at: Date;
}

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  movieId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Rating: Model<IRating> = model<IRating>("Rating", ratingSchema);

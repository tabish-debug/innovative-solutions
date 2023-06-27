import { Document, Schema, Model, model } from "mongoose";
import { esClient } from "../connectElasticSearchDb";

export interface IMovie extends Document {
  userId: string;
  name: string;
  description?: string;
  country: string;
  ticket_price: number;
  release_date: Date;
  genre: string;
  photo: string;
  created_at?: Date;
}

const movieSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    es_indexed: true
  },
  description: {
    type: String,
    required: false,
    es_indexed: true
  },
  country: {
    type: String,
    required: true
  },
  ticket_price: {
    type: Number,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.post<IMovie>("save", async function () {
  try {
    const movie = this;

    await esClient.index({
      index: "movies",
      document: {
        userId: movie.userId.toString(),
        name: movie.name,
        description: movie.description,
        country: movie.country,
        ticket_price: movie.ticket_price,
        release_date: movie.release_date,
        genre: movie.genre,
        photo: movie.photo,
        created_at: movie.created_at
      }
    });

    await esClient.indices.refresh({ index: "movies" });
  } catch (error) {
    console.log("Error indexing document : ", error);
  }
});

export const Movie: Model<IMovie> = model<IMovie>("Movie", movieSchema);

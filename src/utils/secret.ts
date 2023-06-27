import * as dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT as string;
export const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
export const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;
export const MONGODB_URI = process.env.MONGODB_URI as string;
export const ELASTIC_SEARCH_URI = process.env.ELASTIC_SEARCH_URI as string;

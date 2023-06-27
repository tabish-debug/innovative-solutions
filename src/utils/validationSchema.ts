import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { IUser } from "../models/users";
import { refreshToken } from "../interfaces/user";
import { IMovie } from "../models/movies";
import { IRating } from "../models/ratings";
import { IComment } from "../models/comments";

const signUpBodyValidation = (body: IUser) => {
  const schema = Joi.object({
    username: Joi.string().required().label("username"),
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password")
  });

  return schema.validate(body);
};

const logInBodyValidation = (body: IUser) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password")
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body: refreshToken) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("refreshToken")
  });
  return schema.validate(body);
};

const movieBodyValidation = (body: IMovie) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("userId"),
    name: Joi.string().required().label("name"),
    description: Joi.string().label("description"),
    country: Joi.string().required().label("country"),
    ticket_price: Joi.number().required().label("ticket_price"),
    release_date: Joi.date().required().label("release_date"),
    genre: Joi.string().required().label("genre"),
    photo: Joi.string().required().label("photo")
  });
  return schema.validate(body);
};

const movieUpdateBodyValidation = (body: IMovie) => {
  const schema = Joi.object({
    description: Joi.string().label("description"),
    country: Joi.string().required().label("country"),
    ticket_price: Joi.number().required().label("ticket_price"),
    release_date: Joi.date().required().label("release_date"),
    genre: Joi.string().required().label("genre"),
    photo: Joi.string().required().label("photo")
  });
  return schema.validate(body);
};

const ratingBodyValidation = (body: IRating) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("userId"),
    movieId: Joi.string().required().label("userId"),
    rate: Joi.number().min(1).max(5).required().label("rate")
  });
  return schema.validate(body);
};

const commentBodyValidation = (body: IComment) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("userId"),
    movieId: Joi.string().required().label("userId"),
    comment: Joi.string().required().label("comment")
  });
  return schema.validate(body);
};

const commentUpdateBodyValidation = (body: IComment) => {
  const schema = Joi.object({
    comment: Joi.string().required().label("comment")
  });
  return schema.validate(body);
};

export {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
  movieBodyValidation,
  movieUpdateBodyValidation,
  ratingBodyValidation,
  commentBodyValidation,
  commentUpdateBodyValidation
};

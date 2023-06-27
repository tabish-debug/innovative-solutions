import { NextFunction, Request, Response } from "express";
import { movieBodyValidation, movieUpdateBodyValidation } from "../utils/validationSchema";
import { Movie } from "../models/movies";

export class MovieController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { error } = movieBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    try {
      const movie = await Movie.create(req.body);
      return res.status(201).json(movie);
    } catch (error) {
      return res.status(400).json({ error: true, message: error });
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.body;
    let { _id } = req.params;

    const movie = await Movie.findOneAndDelete({ _id, userId });

    if (!movie) {
      return res.status(404).json({ error: true, message: "movie not found" });
    }

    return res.status(204).json();
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const { error } = movieUpdateBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    let { userId } = req.body;
    let { _id } = req.params;

    const movie = await Movie.findOneAndUpdate({ _id, userId }, req.body, { new: true });

    if (!movie) {
      return res.status(404).json({ error: true, message: "movie not found" });
    }

    return res.status(201).json(movie);
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    let { _id } = req.params;

    const movie = await Movie.findOne({ _id });

    if (!movie) {
      return res.status(404).json({ error: true, message: "movie not found" });
    }

    return res.status(200).json(movie);
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    let { page, limit } = req.query;

    const movies = await Movie.find()
      .populate("comments")
      .populate("ratings")
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const totalMovies = await Movie.count();

    const totalPages = Math.ceil(totalMovies / parseInt(limit as string));

    return res.status(200).json({
      data: movies,
      pagination: { pages: totalPages, limit: parseInt(limit as string), total: totalMovies }
    });
  }
}

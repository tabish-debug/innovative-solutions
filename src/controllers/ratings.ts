import { NextFunction, Request, Response } from "express";
import { ratingBodyValidation } from "../utils/validationSchema";
import { Rating } from "../models/ratings";

export class RatingController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { error } = ratingBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    try {
      const rating = await Rating.create(req.body);
      return res.status(201).json(rating);
    } catch (error) {
      return res.status(400).json({ error: true, message: error });
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.body;
    let { _id } = req.params;

    const rating = await Rating.findOneAndDelete({ _id, userId });

    if (!rating) {
      return res.status(404).json({ error: true, message: "rating not found" });
    }

    return res.status(204).json();
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    let { _id } = req.params;

    const rating = await Rating.findOne({ _id });

    if (!rating) {
      return res.status(404).json({ error: true, message: "rating not found" });
    }

    return res.status(200).json(rating);
  }
}

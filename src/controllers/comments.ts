import { NextFunction, Request, Response } from "express";
import { commentBodyValidation, commentUpdateBodyValidation } from "../utils/validationSchema";
import { Comment } from "../models/comments";

export class CommentController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { error } = commentBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    try {
      const comment = await Comment.create(req.body);
      return res.status(201).json(comment);
    } catch (error) {
      return res.status(400).json({ error: true, message: error });
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.body;
    let { _id } = req.params;

    const comment = await Comment.findOneAndDelete({ _id, userId });

    if (!comment) {
      return res.status(404).json({ error: true, message: "comment not found" });
    }

    return res.status(204).json();
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const { error } = commentUpdateBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    let { userId } = req.body;
    let { _id } = req.params;

    const comment = await Comment.findOneAndUpdate({ _id, userId }, req.body, { new: true });

    if (!comment) {
      return res.status(404).json({ error: true, message: "comment not found" });
    }

    return res.status(201).json(comment);
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.body;
    let { _id } = req.params;

    const comment = await Comment.findOne({ _id });

    if (!comment) {
      return res.status(404).json({ error: true, message: "comment not found" });
    }

    return res.status(200).json(comment);
  }

  public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.body;
    let { page, limit } = req.query;

    const comments = await Comment.find(userId)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const totalComments = await Comment.count();

    const totalPages = Math.ceil(totalComments / parseInt(limit as string));

    return res.status(200).json({
      data: comments,
      pagination: { pages: totalPages, limit: parseInt(limit as string), total: totalComments }
    });
  }

  public async getAllByMovieId(req: Request, res: Response, next: NextFunction) {
    let { page, limit, movieId } = req.query;

    const comments = await Comment.find({ movieId })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const totalComments = await Comment.count();

    const totalPages = Math.ceil(totalComments / parseInt(limit as string));

    return res.status(200).json({
      data: comments,
      pagination: { pages: totalPages, limit: parseInt(limit as string), total: totalComments }
    });
  }
}

import { Router } from "express";
import { CommentController } from "../controllers/comments";
import AuthorizationMiddleware from "../middlewares/auth";

class commentRoutes {
  router: Router;
  public commentController: CommentController = new CommentController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/create", AuthorizationMiddleware, this.commentController.create);
    this.router.delete("/delete/:_id", AuthorizationMiddleware, this.commentController.delete);
    this.router.patch("/update/:_id", AuthorizationMiddleware, this.commentController.update);
    this.router.patch("/get/:_id", AuthorizationMiddleware, this.commentController.get);
    this.router.get(
      "/allUserComments",
      AuthorizationMiddleware,
      this.commentController.getAllByUserId
    );
    this.router.get(
      "/allMovieComments",
      AuthorizationMiddleware,
      this.commentController.getAllByMovieId
    );
  }
}

export default commentRoutes;

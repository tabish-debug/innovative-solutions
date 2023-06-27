import { Router } from "express";
import { RatingController } from "../controllers/ratings";
import AuthorizationMiddleware from "../middlewares/auth";

class RatingRoutes {
  router: Router;
  public ratingController: RatingController = new RatingController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  authRoutes() {
    this.router.post("/create", AuthorizationMiddleware, this.ratingController.create);
    this.router.delete("/delete/:_id", AuthorizationMiddleware, this.ratingController.delete);
    this.router.get("/single/:_id", this.ratingController.get);
  }

  routes() {
    this.authRoutes();
  }
}

export default RatingRoutes;

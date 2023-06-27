import { Router } from "express";
import { MovieController } from "../controllers/movies";
import AuthorizationMiddleware from "../middlewares/auth";

class movieRoutes {
  router: Router;
  public movieController: MovieController = new MovieController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/create", AuthorizationMiddleware, this.movieController.create);
    this.router.delete("/delete/:_id", AuthorizationMiddleware, this.movieController.delete);
    this.router.patch("/update/:_id", AuthorizationMiddleware, this.movieController.update);
    this.router.get("/all", this.movieController.getAll);
    this.router.get("/single/:_id", this.movieController.get);
  }
}

export default movieRoutes;

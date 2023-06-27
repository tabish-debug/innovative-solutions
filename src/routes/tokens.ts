import { Router } from "express";
import { RefreshController } from "../controllers/tokens";

class tokenRoutes {
  router: Router;
  public refreshController: RefreshController = new RefreshController();

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/accesstoken", this.refreshController.newAccessToken);
  }
}

export default tokenRoutes;

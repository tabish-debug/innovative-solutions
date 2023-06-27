import { Router } from "express";
import { UserController } from "../controllers/users";

class userRoutes {
  public router: Router;
  public userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/signup", this.userController.signUp);
    this.router.post("/signin", this.userController.signIn);
    this.router.delete("/signout", this.userController.signOut);
  }
}

export default userRoutes;

import express from "express";
import swaggerUi from "swagger-ui-express";
import compression from "compression";
import cors from "cors";
import swaggerAutogen from "swagger-autogen";

import run from "./connectMongoDb";
import { PORT } from "./utils/secret";
import swaggerFile from "./swagger_output.json";
import { doc, endpointsFiles, options, outputFile } from "./swagger";
import movieRoutes from "./routes/movies";
import ratingRoutes from "./routes/ratings";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/users";
import refreshRoutes from "./routes/tokens";

const app = express();

app.set("port", PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());

app.use("/api/user", new userRoutes().router);
app.use("/api/refresh", new refreshRoutes().router);
app.use("/api/movie", new movieRoutes().router);
app.use("/api/rating", new ratingRoutes().router);
app.use("/api/comment", new commentRoutes().router);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

function open(): void {
  swaggerAutogen(options)(outputFile, endpointsFiles, doc);
}

function mongo() {
  run().catch((error) => console.error(error));
}

export default app;

app.listen(app.get("port"), () => {
  console.log(`API is running at http://localhost:${app.get("port")}`);
  mongo();
  open();
});

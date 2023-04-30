import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";



class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }
  private middleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

  }

  private routes(): void {
    this.app.use("/", router);
  }
}

export default new App().app;

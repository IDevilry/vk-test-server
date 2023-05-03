import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

import { type PsimaClient } from "./types";

import dbClient from "./database";

class App {
	public app: express.Application;
	public prisma: PsimaClient;

	constructor(prima: PsimaClient) {
		this.prisma = prima;
		this.app = express();
		this.database();
		this.middleware();
		this.routes();
		this.errorHandlers();
	}

	public start(): void {
		const PORT = process.env.PORT || 3000;
		this.app.listen(PORT, () => {
			console.log(`Server started on http://localhost:${PORT}`);
		});
	}

	private middleware(): void {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}

	private database = async (): Promise<void> => {
		try {
			await this.prisma.$connect();
			this.prisma.$on("beforeExit", async () => {
				await this.prisma.$disconnect();
			});
		} catch {}
	};

	private errorHandlers(): void {
		this.app.use(errorMiddleware);
	}

	private routes(): void {
		this.app.use("/", router);
	}
}

export default new App(dbClient);

import app from "./app";
import dbClient from "./database";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  try {
    await dbClient.$connect();
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    await dbClient.$disconnect();
  }
};

void start();

import { PrismaClient } from "@prisma/client";

const dbClient = new PrismaClient();

dbClient.$on("beforeExit", async () => {
  dbClient.$disconnect();
});

export default dbClient;

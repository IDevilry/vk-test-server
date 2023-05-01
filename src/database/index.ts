import { PrismaClient } from "@prisma/client";

const dbClient = new PrismaClient();

dbClient.$on("beforeExit", async () => {
  await dbClient.$disconnect();
});

export default dbClient;

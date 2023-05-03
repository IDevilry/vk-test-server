import { type Prisma, type PrismaClient } from "@prisma/client";

abstract class Controller {
	public prisma: PrismaClient<
	Prisma.PrismaClientOptions,
	never,
	Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;

	constructor(
		prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>
	) {
		this.prisma = prisma;
	}
}

export default Controller;

import { type NextFunction, type Request, type Response } from "express";
import { type User } from "@prisma/client";

import Controller from "../controller";
import APIException from "../../errors/api.exception";

class UserController extends Controller {
	public async getAllUsers(
		req: Request,
		res: Response<User[]>,
		next: NextFunction
	): Promise<void> {
		try {
			const users = await this.prisma.user.findMany({});

			res.status(200).json(users);
		} catch {
			next(new APIException(500, "Internal server error"));
		}
	}

	public async getUser(
		req: Request<{ id: string }>,
		res: Response<User>,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.params.id) {
				next(new APIException(400, "ID is not provided"));
				return;
			}
			const user = await this.prisma.user.findUnique({
				where: { id_user: Number(req.params.id) },
			});
			if (!user) {
				next(new APIException(404, "User not found"));
				return;
			}
			res.status(200).json(user);
		} catch {
			next(new APIException(500, "Internal server error"));
		}
	}

	public async deleteUser(
		req: Request<{ id: string }>,
		res: Response<{ id_user: number }>,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.params.id) {
				next(new APIException(400, "ID is not provided"));
				return;
			}
			const user = await this.prisma.user.delete({
				where: {
					id_user: Number(req.params.id),
				},
			});
			if (!user) {
				next(new APIException(404, "User not found"));
				return;
			}
			res.status(200).json(user);
		} catch {
			next(new APIException(500, "Internal server error"));
		}
	}

	public async newUser(
		req: Request<unknown, unknown, User>,
		res: Response<User>,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.body.email || !req.body.name || !req.body.password) {
				next(new APIException(400, "Email, name and password are required"));
				return;
			}
			const user = await this.prisma.user.create({
				data: req.body,
			});

			res.status(201).json(user);
		} catch {
			next(new APIException(500, "Internal server error"));
		}
	}
}

export default UserController;

import Controller from "../baseController";
import APIException from "../../errors/api.exception";

import { type NextFunction, type Request, type Response } from "express";
import { type UserApiFields } from "../../types";
import { type User } from "@prisma/client";

class UserController extends Controller {
	public getAllUsers = async (
		req: Request,
		res: Response<User[]>,
		next: NextFunction
	): Promise<void> => {
		try {
			const users = await this.prisma.user.findMany({});

			res.status(200).json(users);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};

	public getUser = async (
		req: Request<{ id: string }>,
		res: Response<User>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkParamsAndThrow(req.params, ["id"], {
				name: "Bad Request",
				message: "ID is not provided",
				status: 400,
			});
			const user = await this.prisma.user.findUnique({
				where: { id_user: Number(req.params.id) },
			});
			if (!user) {
				throw new APIException(404, "Not Found", "User not found");
			}
			res.status(200).json(user);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};

	public deleteUser = async (
		req: Request<{ id: string }>,
		res: Response<{ id_user: number }>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkParamsAndThrow(req.params, ["id"], {
				name: "Bad Request",
				message: "ID is not provided",
				status: 400,
			});
			const user = await this.prisma.user.delete({
				where: {
					id_user: Number(req.params.id),
				},
			});
			if (!user) {
				throw new APIException(404, "Not Found", "User not found");
			}
			res.status(200).json(user);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};

	public newUser = async (
		req: Request<unknown, unknown, UserApiFields>,
		res: Response<User>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkBodyAndThrow(req.body, ["name", "email", "password"]);
			const user = await this.prisma.user.create({
				data: req.body,
			});

			res.status(201).json(user);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};
}

export default UserController;

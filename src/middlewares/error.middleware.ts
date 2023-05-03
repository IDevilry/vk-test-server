/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextFunction, type Request, type Response } from "express";
import type APIException from "../errors/api.exception";

export default function errorMiddleware(
	err: APIException,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	res.status(status).json({ status, message });
}

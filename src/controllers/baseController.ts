import APIException from "../errors/api.exception";

import { type PsimaClient } from "../types";
import { type ParamsDictionary } from "express-serve-static-core";

abstract class Controller {
	constructor(protected readonly prisma: PsimaClient) {
		this.prisma = prisma;
	}

	public checkParamsAndThrow = (
		params: ParamsDictionary,
		fields: string[],
		error?: APIException
	): void => {
		const isExists = fields.every((field) => Number(params[field]))
			? true
			: false;
		if (!isExists && error) {
			throw new APIException(error?.status, error?.name, error?.message);
		}
	};

	public checkBodyAndThrow = (body: any, fields: string[]): void => {
		const missingFields = fields.filter((field) => !body[field]);
		if (missingFields.length > 0) {
			throw new APIException(
				400,
				"Bad Request",
				`Missing fields: ${missingFields.join(", ")}`
			);
		}
	};
}

export default Controller;

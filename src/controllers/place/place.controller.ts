import Controller from "../baseController";
import APIException from "../../errors/api.exception";

import { type Request, type Response, type NextFunction } from "express";
import { type Place } from "../../types";

const places = [
	"place_name",
	"description",
	"photo_url",
	"address",
	"latitude",
	"longtitude",
	"city_name",
	"country_name",
];

class PlaceController extends Controller {
	public getAllPlaces = async (
		req: Request,
		res: Response<Place[] | string>,
		next: NextFunction
	): Promise<void> => {
		try {
			const places = await this.prisma.place.findMany({});
			res.status(200).json(places);
		} catch {
			next(new APIException(500, "Error", "Internal Server Error"));
		}
	};

	public getOnePlace = async (
		req: Request<{ id: string }>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkParamsAndThrow(req.params, ["id"], {
				name: "Bad Request",
				status: 400,
				message: "ID is not provided",
			});

			const place = await this.prisma.place.findUnique({
				where: {
					id_place: Number(req.params.id),
				},
			});

			if (!place) {
				throw new APIException(404, "Not Found", "Place not found");
			}

			res.status(200).json(place);
		} catch (error: Error | any) {
			next(new APIException(error.status, error?.name, error.message));
		}
	};

	public deletePlace = async (
		req: Request<{ id: string }>,
		res: Response<{ id_place: number }>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkParamsAndThrow(req.params, ["id"], {
				name: "Bad Request",
				status: 400,
				message: "ID is not provided",
			});

			const place = await this.prisma.place.findUnique({
				where: {
					id_place: Number(req.params.id),
				},
			});

			if (!place) {
				throw new APIException(404, "Not Found", "Place not found");
			} else {
				const del = await this.prisma.place.delete({
					where: {
						id_place: Number(req.params.id),
					},
					select: {
						id_place: true,
					},
				});

				res.status(200).json(del);
			}
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};

	public newPlace = async (
		req: Request<unknown, unknown, Place>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkBodyAndThrow(req.body, places);
			const newPlace = await this.prisma.place.create({
				data: req.body,
			});

			res.status(201).json(newPlace);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};

	public updatePlace = async (
		req: Request<{ id: string }, unknown, Place>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> => {
		try {
			this.checkParamsAndThrow(req.params, ["id"], {
				name: "Bad Request",
				message: "ID is not provided",
				status: 400,
			});

			this.checkBodyAndThrow(req.body, places);

			const place = await this.prisma.place.update({
				where: {
					id_place: Number(req.params.id),
				},
				data: req.body,
			});

			if (!place) {
				throw new APIException(404, "Not Found", "Place not found");
			}

			res.status(201).json(place);
		} catch (error: Error | any) {
			next(new APIException(error?.status, error?.name, error?.message));
		}
	};
}

export default PlaceController;

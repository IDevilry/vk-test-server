import { type Request, type Response, type NextFunction } from "express";
import { type Place } from "../../types";
import Controller from "../controller";
import APIException from "../../errors/api.exception";

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
	public async getAllPlaces(
		req: Request,
		res: Response<Place[] | string>,
		next: NextFunction
	): Promise<void> {
		try {
			const places = await this.prisma.place.findMany({});
			res.status(200).json(places);
		} catch {
			next(new APIException(500, "Internal Server Error"));
		}
	}

	public async getOnePlace(
		req: Request<{ id: string }>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.params?.id) {
				next(new APIException(400, "ID is not provided"));
				return;
			}
			const place = await this.prisma.place.findUniqueOrThrow({
				where: {
					id_place: Number(req.params.id),
				},
			});

			if (!place) {
				next(new APIException(404, "Place not found"));
				return;
			}

			res.status(200).json(place);
			return;
		} catch {
			next(new APIException(500, "Internal Server Error"));
		}
	}

	public async deletePlace(
		req: Request<{ id: string }>,
		res: Response<{ id_place: number }>,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.params?.id) {
				next(new APIException(400, "ID is not provided"));
				return;
			}
			const place = await this.prisma.place.delete({
				where: {
					id_place: Number(req.params.id),
				},
				select: {
					id_place: true,
				},
			});

			if (!place) {
				next(new APIException(404, "Place not found"));
				return;
			}

			res.status(200).json(place);
		} catch {
			next(new APIException(500, "Internal Server Error"));
		}
	}

	public async newPlace(
		req: Request<unknown, unknown, Place>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> {
		try {
			const missingFields = places.filter((field) => !req.body[field]);
			if (missingFields.length > 0) {
				next(
					new APIException(400, `Missing fields: ${missingFields.join(", ")}`)
				);
				return;
			}

			const newPlace = await this.prisma.place.create({
				data: req.body,
			});

			res.status(201).json(newPlace);
		} catch {
			next(new APIException(500, "Internal Server Error"));
		}
	}

	public async updatePlace(
		req: Request<{ id: string }, unknown, Place>,
		res: Response<Place>,
		next: NextFunction
	): Promise<void> {
		try {
			const missingFields = places.filter((field) => !req.body[field]);
			if (missingFields.length > 0) {
				next(
					new APIException(400, `Missing fields: ${missingFields.join(", ")}`)
				);
				return;
			}

			if (!req.params?.id) {
				next(new APIException(400, "ID is not provided"));
				return;
			}

			const place = await this.prisma.place.update({
				where: {
					id_place: Number(req.params.id),
				},
				data: req.body,
			});

			if (!place) {
				next(new APIException(404, "Place not found"));
				return;
			}

			res.status(201).json(place);
		} catch {
			next(new APIException(500, "Internal Server Error"));
		}
	}
}

export default PlaceController;

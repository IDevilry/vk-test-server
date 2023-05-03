import { PlaceController } from "..";
import { prismaMock } from "../../__mocks__/mockPrisma";
import { type NextFunction, type Request, type Response } from "express";

describe("Place Controller", () => {
	const mockResponse = (): Response => {
		const res = {} as unknown as Response;
		res.status = jest.fn().mockReturnThis();
		res.json = jest.fn();
		return res;
	};

	const mockRequest = (params?: any): Request<{ id: string }> => {
		const req = {
			body: {
				place_name: "Test",
				description: "test",
				photo_url: "test",
				address: "test",
				latitude: 123456,
				longtitude: 654321,
				city_name: "test",
				country_name: "test",
			},
		} as unknown as Request;
		if (params?.id) {
			req.params = {
				id: params.id,
			};
		}
		return req as unknown as Request<{ id: string }>;
	};

	afterAll(async () => {
		await prismaMock.$disconnect();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const controller = new PlaceController(prismaMock);

	const req = mockRequest({ id: "99999" });
	const res = mockResponse();
	const next = jest.fn() as unknown as NextFunction;

	it("/ : should return places list", async () => {
		await controller.getAllPlaces(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("/:id : should return status 404 if place not exists", async () => {
		const req = mockRequest({ id: "99999" });
		await controller.getOnePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/:id : should return status 400 if id is not exists", async () => {
		const req = mockRequest();
		await controller.getOnePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/delete : should return 400 if id in not exists", async () => {
		const req = mockRequest();
		await controller.deletePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/delete : should return 404 if place in not exists", async () => {
		const req = mockRequest({ id: "99999" });
		await controller.deletePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/new : should return new place", async () => {
		await controller.newPlace(req, res, next);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	it("/new : should return status code 400 if missing flields", async () => {
		const req = {
			body: {
				place_name: "Test",
				photo_url: "test",
				address: "test",
				latitude: 123456,
				longtitude: 654321,
				city_name: "test",
				country_name: "test",
			},
		} as unknown as Request;
		await controller.newPlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/update : should return status code 404 if id is not found", async () => {
		const req = mockRequest({ id: "99999" });
		await controller.updatePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it("/update : should return status code 400 if body is not exists", async () => {
		const req = {
			body: {
				place_name: "Test",
				photo_url: "test",
				latitude: 123456,
				longtitude: 654321,
				city_name: "test",
				country_name: "test",
			},
		} as unknown as Request<{ id: never }>;
		await controller.updatePlace(req, res, next);
		expect(res.json).not.toHaveBeenCalledWith(undefined, null);
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});
});

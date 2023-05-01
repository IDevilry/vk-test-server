/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PlaceController } from "../controllers";
import { prismaMock } from "../__mocks__/mockPrisma";
import { type Request, type Response } from "express";

describe("Place Controller", () => {
  const mockResponse = (): Response => {
    const res = {} as unknown as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  const mockRequest = (params?: any) => {
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
    return req as unknown as Request;
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

  it("/ : should return places list", async () => {
    await controller.getAllPlaces(req, res, () => {});
    expect(res.json).not.toHaveBeenCalledWith(undefined, null);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("/:id : should return status 404 if place not exists", async () => {
    await controller.getOnePlace(req, res, () => {});
    expect(res.json).not.toHaveBeenCalledWith(undefined, null);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("/:id : should return status 400 if id is not exists", async () => {
    const req = mockRequest();
    await controller.getOnePlace(req, res, () => {});
    expect(res.json).not.toHaveBeenCalledWith(undefined, null);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("/delete : should return 400 if id in not exists", async () => {
    const req = mockRequest();
    await controller.deletePlace(req, res, () => {});
    expect(res.json).not.toHaveBeenCalledWith(undefined, null);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("/delete : should return 404 if place in not exists", async () => {
    const req = mockRequest({ id: "99999" });
    await controller.deletePlace(req, res, () => {});
    expect(res.json).not.toHaveBeenCalledWith(undefined, null);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("/new : should return new place", async () => {
    await controller.newPlace(req, res, () => {});
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
    await controller.newPlace(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing fields: description",
    });
  });

  it("/update : should return status code 404 if id is not found", async () => {
    const req = mockRequest({ id: "99999" });
    await controller.updatePlace(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
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
    } as unknown as Request;
    await controller.updatePlace(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing fields: description, address",
    });
  });
});

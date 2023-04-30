import { Request, Response, NextFunction } from "express";
import { places } from "../types";
import { Prisma, PrismaClient } from "@prisma/client";

class PlaceController {
  static prisma: PrismaClient<
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
    PlaceController.prisma = prisma;
  }

  public async getAllPlaces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const places = await PlaceController.prisma.place.findMany({});
      res.status(200).json(places);
    } catch (error) {
      res.status(500).json("Произошла ошибка");
    }
  }

  public async getOnePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params?.id) {
        res.status(400).json("ID is not exists");
        return;
      }
      const place = await PlaceController.prisma.place.findFirst({
        where: {
          id_place: Number(req.params.id),
        },
      });

      if (!place) {
        res.status(404).json("Не найдено");
        return;
      }

      res.status(200).json(place);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Произошла ошибка");
    }
  }

  public async deletePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params?.id) {
        res.status(400).json("ID is not exists");
        return;
      }
      const place = await PlaceController.prisma.place.delete({
        where: {
          id_place: Number(req.params.id),
        },
        select: {
          id_place: true,
        },
      });

      if (!place) {
        res.status(404).json("Не найдено");
        return;
      }

      res.status(200).json(place);
    } catch (error) {
      console.log(error);
      res.status(500).json("Произошла ошибка");
    }
  }

  public async newPlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const missingFields = places.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(400).json({
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const newPlace = await PlaceController.prisma.place.create({
        data: req.body,
        select: {
          id_place: true,
        },
      });

      res.status(201).json(newPlace);
    } catch (error) {
      console.log(error);
      res.status(500).json("Произошла ошибка");
    }
  }

  public async updatePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const missingFields = places.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(400).json({
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      if (!req.params?.id) {
        res.status(400).json("ID is not exists");
        return;
      }

      const place = await PlaceController.prisma.place.update({
        where: {
          id_place: Number(req.params.id),
        },
        data: req.body,
      });

      if (!place) {
        res.status(404).json("Не найдено");
        return;
      }

      res.status(201).json(place);
    } catch (error) {
      console.log(error);
      res.status(500).json("Произошла ошибка");
    }
  }
}

export default PlaceController;

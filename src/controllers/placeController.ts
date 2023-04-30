import { Request, Response, NextFunction } from "express";
import { Controller } from "./controller";

import dbClient from "../database";

class PlaceController extends Controller {
  public async getAllPlaces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const places = await dbClient.place.findMany({
        include: this.includeFields(),
      });
      res.send(places);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
  public async getOnePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkIdParam(req, res, next);
      const place = await dbClient.place.findUnique({
        where: {
          id_place: Number(req.params.id),
        },
        include: this.includeFields(),
      });
      if (!place) {
        res.status(400).send();
        return;
      }
      res.send(place);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  public async newPlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const place = await dbClient.place.create({
        data: {
          description: req.body.description,
          photo_url: req.body.photo_url,
          place_name: req.body.place_name,
          address: req.body.address,
          latitude: req.body.latitude,
          longtitude: req.body.longitude,
          city: {
            create: {
              city_name: req.body.city_name,
              country: {
                create: {
                  country_name: req.body.country_name,
                },
              },
            },
          },
        },
        include: this.includeFields(),
      });
      res.send(place);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  public async deletePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkIdParam(req, res, next);
      const place = await dbClient.place.delete({
        where: {
          id_place: Number(req.params.id),
        },
      });
      res.send(String(place.id_place));
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  public async updatePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkIdParam(req, res, next);
      const updatedPlace = await dbClient.place.update({
        where: {
          id_place: Number(req.params.id),
        },
        data: {
          description: req.body.description,
          photo_url: req.body.photo_url,
          place_name: req.body.place_name,
          cityId: req.body.cityId,
        },
        include: this.includeFields(),
      });
      res.send(updatedPlace);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
}

export default new PlaceController();

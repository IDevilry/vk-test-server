import { Request, Response, NextFunction } from "express";
import dbClient from "../database";

const includeFields = () => {
  return {
    city: {
      select: {
        city_name: true,
        country: {
          select: {
            country_name: true,
          },
        },
      },
    },
  };
};

class PlaceController {
  public async getAllPlaces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const places = await dbClient.place.findMany({
        include: includeFields(),
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
      if (!req.params.id || isNaN(Number(req.params.id))) {
        res.status(400).send();
        return;
      }
      const place = await dbClient.place.findUnique({
        where: {
          id_place: Number(req.params.id),
        },
        include: includeFields(),
      });
      if (!place) {
        res.status(404).send();
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
    const connectCityId = await dbClient.city.findFirst({
      where: { city_name: req.body.city_name },
      select: { id: true },
    });
    const countryId = await dbClient.country.findFirst({
      where: { country_name: req.body.country_name },
      select: { id: true },
    });
    const place = await dbClient.place.create({
      data: {
        description: req.body.description,
        photo_url: req.body.photo_url,
        place_name: req.body.place_name,
        address: req.body.address,
        latitude: req.body.latitude,
        longtitude: req.body.longitude,
        city: {
          connectOrCreate: {
            where: { id: connectCityId?.id },
            create: {
              city_name: req.body.city_name,
              country: {
                connectOrCreate: {
                  where: { id: countryId?.id },
                  create: { country_name: req.body.country_name },
                },
              },
            },
          },
        },
      },
      include: includeFields(),
    });
    res.send(place);
  }

  public async deletePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params.id) {
        res.sendStatus(400);
        return;
      }
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
      if (!req.params.id) {
        res.sendStatus(400);
        return;
      }
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
        include: includeFields(),
      });
      res.send(updatedPlace);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
}

export default new PlaceController();

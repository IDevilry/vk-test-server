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
      const place = await dbClient.place.findUnique({
        where: {
          id_place: req.body.id_place,
        },
        include: includeFields(),
      });
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
        include: includeFields(),
      });
      res.send(place);
    } catch (error) {
      res.status(500).send("Не удалось добавить");
    }
  }

  public async deletePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const place = await dbClient.place.delete({
        where: {
          id_place: req.body.id_place,
        },
      });
      res.send(place.id_place);
    } catch (error) {
      res.status(500).send("Не удалось удалить");
    }
  }

  public async updatePlace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedPlace = await dbClient.place.update({
        where: {
          id_place: req.body.id_place,
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
      res.status(500).send("Error");
    }
  }
}

export default new PlaceController();

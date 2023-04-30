import { NextFunction, Request, Response } from "express";

export abstract class Controller {
  public checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      res.sendStatus(400);
      return;
    }
    next();
  };

  public validateFields = (req: Request, res: Response, next: NextFunction) => {
    
  }

  public includeFields = () => {
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
}

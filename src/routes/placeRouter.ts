import { Router } from "express";
import { PlaceController } from "../controllers";
import dbClient from "../database";

const controller = new PlaceController(dbClient);

const placeRouter = Router();

placeRouter.get("/", controller.getAllPlaces);
placeRouter.get("/:id", controller.getOnePlace);
placeRouter.post("/new", controller.newPlace);
placeRouter.patch("/update/:id", controller.updatePlace);
placeRouter.delete("/delete/:id", controller.deletePlace);

export { placeRouter };

import { Router } from "express";
import { PlaceController } from "../controllers";

const placeRouter = Router();

placeRouter.get("/", PlaceController.getAllPlaces);
placeRouter.post("/one", PlaceController.getOnePlace);
placeRouter.post("/new", PlaceController.newPlace);
placeRouter.patch("/update", PlaceController.updatePlace);
placeRouter.delete("/delete", PlaceController.deletePlace);

export { placeRouter };

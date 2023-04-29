import { Router } from "express";
import { PlaceController } from "../controllers";

const placeRouter = Router();

placeRouter.get("/", PlaceController.getAllPlaces);
placeRouter.get("/:id", PlaceController.getOnePlace);
placeRouter.post("/new", PlaceController.newPlace);
placeRouter.patch("/update/:id", PlaceController.updatePlace);
placeRouter.delete("/delete/:id", PlaceController.deletePlace);

export { placeRouter };

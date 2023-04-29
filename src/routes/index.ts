import { Router } from "express";
import { placeRouter } from "./placeRouter";

const router = Router();

router.use("/api/v1/places", placeRouter);

export default router;

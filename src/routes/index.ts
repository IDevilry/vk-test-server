import { Router } from "express";
import { placeRouter } from "./place/placeRouter";
import { userRouter } from "./user/userRouter";

const router = Router();

router.use("/api/v1/places", placeRouter);
router.use("/api/v1/users", userRouter);

export default router;

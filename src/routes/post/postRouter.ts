import { Router } from "express";
import PostController from "../../controllers/postController";

const postRouter = Router();

postRouter.get("/", PostController.getAllPosts);
postRouter.get("/my", PostController.getMyPosts);
postRouter.get("/:id", PostController.getPost);
postRouter.post("/new", PostController.newPost);
postRouter.post("/update/:id", PostController.updatePost);
postRouter.post("/like", PostController.toggleLike);

export { postRouter };

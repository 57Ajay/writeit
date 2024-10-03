import { Hono } from "hono";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../utils/rateLimiter";
import { createPost, getBlog } from "../controllers/blog.controller";

const blogRouter = new Hono();
blogRouter.post("/create", authenticate, rateLimiter(1, 3), createPost);
blogRouter.get("/:id", rateLimiter(1, 5), getBlog);


export default blogRouter;

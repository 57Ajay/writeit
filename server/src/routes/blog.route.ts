import { Hono } from "hono";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../utils/rateLimiter";
import { createPost } from "../controllers/blog.controller";

const blogRouter = new Hono();
blogRouter.post("/create", authenticate, rateLimiter(1, 3), createPost);


export default blogRouter;

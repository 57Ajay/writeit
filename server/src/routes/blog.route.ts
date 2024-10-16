import { Hono } from "hono";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../utils/rateLimiter";
import { createPost, getAllBlogs, getBlog, getBlogByUser, updateBlogPost, deleteBlogs } from "../controllers/blog.controller";

const blogRouter = new Hono();
blogRouter.post("/create", authenticate, rateLimiter(10, 3), createPost);
blogRouter.get("/get-all", rateLimiter(10, 3), getAllBlogs);
blogRouter.post("/update", authenticate, updateBlogPost);
blogRouter.get("/get-by-user", rateLimiter(10, 5), getBlogByUser);
blogRouter.get("/:id", rateLimiter(10, 2), getBlog);
blogRouter.delete("/delete", rateLimiter(10, 5), authenticate, deleteBlogs)
export default blogRouter;

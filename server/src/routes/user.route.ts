import { Hono } from "hono";
import { signUp, signIn, getUser, getUserById } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../utils/rateLimiter";

const userRoute = new Hono();

userRoute.post("/signin", rateLimiter(1, 5), signIn);
userRoute.post("/signup", signUp);
userRoute.get("/user", authenticate, getUser);
userRoute.get("user/:id", authenticate, getUserById);
export default userRoute;

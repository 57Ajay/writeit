import { Hono } from "hono";
import { signUp, signIn, getUser, getUserById, logOutUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../utils/rateLimiter";

const userRoute = new Hono();

userRoute.post("/signin", rateLimiter(1, 5), signIn);
userRoute.post("/signup", rateLimiter(1, 5), signUp);
userRoute.post("/signout", authenticate, logOutUser);
userRoute.get("/get-user", rateLimiter(1, 5), authenticate, getUser);
userRoute.get("/:id", rateLimiter(1, 5), authenticate, getUserById);
export default userRoute;

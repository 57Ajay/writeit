import { Hono } from "hono";
import { signUp, signIn, getUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRoute = new Hono();

userRoute.post("/signin", signIn);
userRoute.post("/signup", signUp);
userRoute.get("/user", authenticate, getUser);
export default userRoute;

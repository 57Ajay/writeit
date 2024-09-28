import { Hono } from "hono";
import { signUp, signIn } from "../controllers/user.controller";

const userRoute = new Hono();

userRoute.post("/signin", signIn);
userRoute.post("/signup", signUp);

export default userRoute;

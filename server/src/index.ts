import { Hono } from 'hono'
import userRoute from './routes/user.route'
import { prismaClientMiddleware } from './middlewares/auth.middleware';

const app = new Hono();

app.use("*", prismaClientMiddleware)

app.route("/api/v1/auth", userRoute);

app.get("/", (c) => {
  return c.text("THis is medium application")
})

export default app

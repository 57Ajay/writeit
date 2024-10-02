import { Hono } from 'hono'
import userRoute from './routes/user.route'
import { prismaClientMiddleware } from './middlewares/auth.middleware';
import blogRouter from './routes/blog.route';

const app = new Hono();

app.use("*", prismaClientMiddleware)

app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("THis is medium application")
})

export default app

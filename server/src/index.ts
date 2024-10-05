import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoute from './routes/user.route'
import { prismaClientMiddleware } from './middlewares/auth.middleware';
import blogRouter from './routes/blog.route';

const app = new Hono();

app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
})
);
app.use("*", prismaClientMiddleware)

app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("THis is medium application")
})

export default app

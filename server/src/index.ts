import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoute from './routes/user.route'
import { prismaClientMiddleware } from './middlewares/auth.middleware';
import blogRouter from './routes/blog.route';

const app = new Hono();

const allowedOrigins = [
  'https://storyarc.underroot-1.online',
  'https://writeit-aac8p0v24-57ajayu-gmailcoms-projects.vercel.app'
];

app.use("*", cors({
  origin: (origin) => {
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));


app.use("*", prismaClientMiddleware)

app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("THis is blog application backend, developed by Ajay Upadhyay")
});

export default app

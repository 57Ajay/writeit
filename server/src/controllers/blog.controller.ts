import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { z, ZodError } from 'zod';

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10)
});

type postBody = z.infer<typeof postSchema>;

export const createPost = async (c: Context) => {
  const user = c.get("user");
  let post: postBody;
  if (!user) {
    throw new HTTPException(403, { message: "Log in to create a post." })
  }
  const prisma = c.get("prisma");
  try {
    post = postSchema.parse(await c.req.json());
  } catch (error: any) {
    console.error(error);
    if (error instanceof HTTPException) {
      throw new HTTPException(500, { message: "Wrong request body" })
    } else if (error instanceof ZodError) {
      throw new HTTPException(400, { message: `Please provide correct Schema: ${error.message}` })
    } else {
      throw new HTTPException(500, { message: "Something went wrong." })
    };
  };
  const { title, content } = post;
  try {
    const post = await prisma.post.create({
      data: {
        title, content, authorId: user.id
      }
    });
    if (!post) {
      throw new HTTPException(404, { message: "failed to create post." })
    };

    return c.json({
      post
    })

  } catch (error) {
    console.error(error);
    if (error instanceof HTTPException) {
      throw new HTTPException(500, { message: "Cannot createPost, try again later." })
    } else {
      throw new HTTPException(500, { message: "Something went wrong" })
    }
  }
};


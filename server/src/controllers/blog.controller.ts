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

export const getBlog = async (c: Context) => {
  const prisma = c.get("prisma");
  try {
    const id = c.req.param("id");
    if (!id) {
      throw new HTTPException(403, { message: "Please provide blog id" });
    };

    const post = await prisma.post.findUnique({
      where: {
        id
      }
    });

    if (!post) {
      throw new HTTPException(404, { message: "Blog not found." })
    };

    return c.json({
      post
    });
  } catch (error: any) {
    if (error instanceof HTTPException) {
      console.log(error)
      throw new HTTPException(411, { message: "Server failear, try again" });
    } else {
      console.log(error)
      throw new HTTPException(500, { message: "Something went wrong, try aagain." });
    };
  };
};

export const getAllBlogs = async (c: Context) => {
  try {
    const page: number = parseInt(c.req.query("page") || "1", 10);
    const limit: number = parseInt(c.req.query("limit") || "10", 10);
    const prisma = c.get("prisma");

    const skip: number = (page - 1) * limit;
    const take: number = limit;

    const posts = await prisma.post.findMany({
      skip,
      take
    });

    // console.log("these are blogs: \n", blogs);
    const totalBlogs = await prisma.post.count();


    return c.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
  } catch (error: any) {
    if (error instanceof HTTPException) {
      console.error(error);
      throw new HTTPException(411, { message: "Server failure, try again" });
    } else {
      console.log(error);
      throw new HTTPException(500, { message: `Something went wrong: \n ${error.message}` });
    }
  }
};


export const updateBlogPost = async (c: Context) => {
  let input: postBody;
  const user = c.get("user");
  const prisma = c.get("prisma");

  const blogId = c.req.query("id");
  if (!blogId) {
    throw new HTTPException(401, { message: "please provide id as query parameter." })
  };
  try {
    input = postSchema.parse(await c.req.json());
    const { title, content } = input;
    const updateBlog = await prisma.post.update({
      where: {
        id: blogId, authorId: user.id
      },
      data: {
        title, content
      }
    });
    if (!updateBlog) {
      throw new HTTPException(404, { message: "Failed to update post, You can only update your own post" })
    }
    return c.json({ updateBlog })
  } catch (error: any) {
    if (error instanceof HTTPException) {
      console.error(error);
      throw new HTTPException(404, { message: "server unreachable." });
    } else {
      if (error)
        throw new HTTPException(500, { message: "You can only edit your own posts." })
    };
  };
};

export const getBlogByUser = async (c: Context) => {
  const userId = c.req.query("id");
  if (!userId) {
    throw new HTTPException(403, { message: "userId not found" });
  };
  try {
    const prisma = c.get("prisma");
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (user === null) {
      throw new HTTPException(403, { message: "Bad request" });
    };
    const userBlogs = await prisma.post.findMany({
      where: {
        authorId: userId
      }
    });
    if (!userBlogs) {
      throw new HTTPException(404, { message: "failed to find userBlogs" })
    };
    c.status(200)
    return c.json({
      userBlogs
    })
  } catch (error: any) {
    if (error instanceof HTTPException) {
      throw new HTTPException(500, { message: "Server unreachable." })
    } else {
      throw new HTTPException(500, { message: "Something went wrong." })
    };
  };
};

export const deleteBlogs = async (c: Context) => {
  try {
    const { blogIds } = await c.req.json();
    if (!blogIds) {
      throw new HTTPException(403, { message: "Please provide atleast one blogId" })
    }
    const user = c.get("user");
    const prisma = c.get("prisma");
    const deleteBlogs = await prisma.post.deleteMany({
      where: {
        id: {
          in: blogIds
        },
        authorId: user.id
      }
    });
    if (!deleteBlogs) {
      throw new HTTPException(400, { message: "Delete blogs failed" })
    };
    c.status(200)
    return c.json({ deletedBlogs: deleteBlogs })
  } catch (error) {
    if (error instanceof HTTPException) {
      console.log(error)
      throw new HTTPException(500, { message: "server unreachable" })
    } else {
      console.log(error)
      throw new HTTPException(500, { message: "Something went wrong" })
    };
  };
};

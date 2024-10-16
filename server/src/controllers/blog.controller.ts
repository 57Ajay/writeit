import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { z, ZodError } from 'zod';

const createBlogSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string(),
  published: z.boolean().default(false)
});

export const createPost = async (c: Context) => {
  const prisma = c.get("prisma");
  const user = c.get("user");

  try {
    const result = createBlogSchema.safeParse(await c.req.json());

    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid blog data" });
    }

    const { title, content, published } = result.data;
    console.log("title: \n", title, "\ncontent: \n", content);
    const blog = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({
      blog,
    });
  } catch (error: any) {
    if (error instanceof HTTPException) {
      console.log(error);
      throw new HTTPException(400, { message: error.message });
    } else if (error instanceof ZodError) {
      console.log(error);
      throw new HTTPException(400, { message: error.message });
    } else {
      console.log(error);
      throw new HTTPException(500, {
        message: "Something went wrong, try again.",
      });
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
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
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
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
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

const updateBlogSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().optional(),
  published: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export const updateBlogPost = async (c: Context) => {
  console.log("Request Reached here");
  const prisma = c.get("prisma");
  const user = c.get("user");

  try {
    const postId = c.req.query("id");
    console.log("PostId: \n", postId);
    if (!postId) {
      throw new HTTPException(400, { message: "Post ID is required" });
    };

    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!existingPost) {
      throw new HTTPException(404, { message: "Blog post not found" });
    }

    if (existingPost.authorId !== user.id) {
      throw new HTTPException(403, { message: "You can only update your own posts" });
    }

    const result = updateBlogSchema.safeParse(await c.req.json());
    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid update data" });
    }

    const updateData: any = {};
    if (result.data.title) updateData.title = result.data.title;
    if (result.data.content) updateData.content = result.data.content;
    if (result.data.published !== undefined) updateData.published = result.data.published;
    const updatedBlog = await prisma.post.update({
      where: {
        id: postId,
      },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({
      blog: updatedBlog,
    });
  } catch (error: any) {
    if (error instanceof HTTPException) {
      console.log(error);
      throw error;
    } else if (error instanceof ZodError) {
      console.log(error);
      throw new HTTPException(400, { message: error.message });
    } else {
      console.log(error);
      throw new HTTPException(500, {
        message: "Something went wrong, try again.",
      });
    }
  }
};

export const getBlogByUser = async (c: Context) => {
  console.log("THis is hello from getBlogByUser.")
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
    console.log("user: \n", user);
    if (user === null) {
      throw new HTTPException(403, { message: "Bad request" });
    };
    const userBlogs = await prisma.post.findMany({
      where: {
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }

        }
      }
    });
    console.log("user blogs: \n", userBlogs)
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
  console.log("Delete blogs hits`")
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

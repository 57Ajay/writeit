import { Context } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/generateToken";
import { deleteExpiredTokens } from "../utils/deleteExpiredTokens";


const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

type SignUpInput = z.infer<typeof signUpSchema>;

export const signUp = async (c: Context) => {
  const prisma = c.get("prisma")
  let input: SignUpInput;

  try {
    input = signUpSchema.parse(await c.req.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, { message: error.message });
    }
    throw new HTTPException(400, { message: 'Invalid input' });
  }

  const { email, password, name } = input;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new HTTPException(409, { message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }, 201);

  } catch (error) {
    console.error('SignUp error:', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: 'An error occurred during sign up' });
  }
};


const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

type signInInput = z.infer<typeof signInSchema>;

export const signIn = async (c: Context) => {
  const prisma = c.get("prisma");

  let input: signInInput;
  try {
    input = signInSchema.parse(await c.req.json());
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, { message: error.message });
    }
    throw new HTTPException(400, { message: "Invalid input" });
  }

  const { email, password } = input;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new HTTPException(400, { message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new HTTPException(403, { message: "Invalid password" });
    }
    const deletedTokens = await deleteExpiredTokens(c, prisma, user.id);

    const token = await generateToken(user.id, c, prisma);

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      },
      deletedTokens
    }, 200);

  } catch (error) {
    console.error('SignIn error:', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: 'An error occurred during signin' });
  }
};

export const getUser = async (c: Context) => {
  try {
    const prisma = c.get("prisma")
    const user = c.get('user');
    const userId = user.id;

    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        posts: true,
      },
    });

    if (!findUser) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json({
      message: 'Access granted',
      findUser,
    }, 200);
  } catch (error: any) {
    console.error(error);
    throw new HTTPException(500, { message: 'Internal Server Error' });
  };
};

export const getUserById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const prisma = c.get("prisma");
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: user.tokens[0]
      }
    })
  } catch (error: any) {
    if (error instanceof HTTPException) {
      throw new HTTPException(500, { message: "Please inter valid userId " });
    } else {
      throw new HTTPException(500, { message: "Something went wrong." });
    };
  };
};

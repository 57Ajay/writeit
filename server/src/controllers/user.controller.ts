import { Context } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcryptjs';
import createPrismaClient from "../../prisma/prisma";
import { generateToken } from "../utils/generateToken";


const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

type SignUpInput = z.infer<typeof signUpSchema>;

export const signUp = async (c: Context) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL)
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
  password: z.string().min(6)
});

type signInInput = z.infer<typeof signInSchema>;

export const signIn = async (c: Context) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  let input: signInInput;

  try {
    input = signInSchema.parse(await c.req.json());

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, { message: error.message });
    };
    throw new HTTPException(400, { message: "Invalid input" });
  };

  const { email, password } = input;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      return new HTTPException(400, { message: "User not found" })
    };
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return new HTTPException(403, { message: "Invalid password" });
    };
    await generateToken(user.id, c.env.DATABASE_URL);
    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tokens: user.tokens
      }
    }, 200)
  } catch (error) {
    console.error('SignIp error:', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: 'An error occurred during sigin' });

  }
}


import { Context, Next } from "hono";
import createPrismaClient from "../../prisma/prisma";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const authenticate = async (c: Context, next: Next) => {
  try {
    const token = c.req.header("Authorization");
    if (!token) {
      throw new HTTPException(401, { message: "Authorization token not provided." });
    }

    const bearerToken = token.split(" ")[1];
    if (!bearerToken) {
      throw new HTTPException(401, { message: "Invalid Authorization header format." });
    }
    // console.log("THis is token from authenticate: \n", bearerToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const prisma = await createPrismaClient(c.env.DATABASE_URL);
    const payload = await verify(bearerToken, c.env.JWT_SECRET);

    if (!payload.exp) {
      return new HTTPException(400, { message: "Invalid token with no expiry" });
    };

    if (typeof payload !== 'object' || !payload.id || payload.exp < currentTimestamp) {
      throw new HTTPException(401, { message: "Invalid token payload." });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user) {
      throw new HTTPException(401, { message: "User not found." });
    }

    c.set('user', user);
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error(error);
    throw new HTTPException(500, { message: "Internal server error during authentication." });
  }
};

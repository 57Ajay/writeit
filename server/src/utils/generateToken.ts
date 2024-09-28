import { Context } from "hono";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

export const generateToken = async (userId: string, c: Context, prisma: any) => {
  try {

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HTTPException(404, { message: "User not found." });
    }
    const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const tokenVal = await sign({ id: userId, exp: expirationTime }, c.env.JWT_SECRET);

    await prisma.user.update({
      where: { id: userId },
      data: { tokens: { push: tokenVal.toString() } },
    });

    return tokenVal;

  } catch (error: any) {
    if (error instanceof HTTPException) {
      return new HTTPException(500, { message: `Something went wrong, can not generate token.: ${error.message}` });
    } else {
      console.log(error);
      return c.json({
        msg: "Token not generated",
        error: error.message
      })
    };
  };
};

import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { verify } from "hono/jwt";

export const deleteExpiredTokens = async (c: Context, prisma: any, userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);


    const validTokens = (await Promise.all(
      user.tokens.map(async (token: string) => {
        try {
          const decoded = await verify(token, c.env.JWT_SECRET);

          return typeof decoded === 'object' && decoded.exp && decoded.exp > currentTimestamp ? token : null;
        } catch (error) {
          return null;
        }
      })
    )).filter(token => token !== null);

    await prisma.user.update({
      where: { id: userId },
      data: { tokens: validTokens }
    });

    const deletedCount = user.tokens.length - validTokens.length;
    console.log("Deleted this much tokens: \n", deletedCount);
    return {
      message: `Deleted ${deletedCount} expired token(s)`,
      remainingTokens: validTokens.length
    }

  } catch (error: any) {
    if (error instanceof HTTPException) {
      throw error;
    } else {
      console.error("Token deletion error:", error);
      throw new HTTPException(500, { message: "Failed to delete expired tokens" });
    }
  }
};


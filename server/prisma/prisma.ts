import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


type ExtendedPrismaClient = any;

declare global {
  var prisma: ExtendedPrismaClient | undefined;
}

const createPrismaClient = (databaseUrl: string) => {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      datasourceUrl: databaseUrl,
    }).$extends(withAccelerate());
  }
  return globalThis.prisma;
};

export default createPrismaClient;

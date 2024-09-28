import createPrismaClient from "../../prisma/prisma";

const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$&-_';
  const charactersLength = characters.length;
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % charactersLength);
  }
  return result;
}

export const generateToken = async (userId: string, dbUrl: string) => {
  const prisma = createPrismaClient(dbUrl);
  const tokenVal = `${generateRandomString(64)}${userId}`;
  const tokenExpiry = new Date(Date.now() + 10800000); // 3 hours from now
  const tokenData: any = {
    value: tokenVal,
    expiresAt: tokenExpiry,
    userId: userId
  }
  const token = await prisma.token.create({
    data: tokenData
  });

  return token;
}

import { PrismaClient } from "@prisma/client";

// Clear cache during hot reload if schema changed
delete (globalThis as any).prisma;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In Prisma 7, we don't pass the URL in the constructor if it's in prisma.config.ts / .env,
// Prisma automatically picks it up from the environment.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

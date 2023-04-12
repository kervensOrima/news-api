import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: ['query', 'warn', 'info', 'error'] })
export const SECRET = 'my-secret'
import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

const user = prisma.auditLog.create({ date: {} });

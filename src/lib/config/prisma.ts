import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const adapter = new PrismaAdapter(prisma.authSession, prisma.authUser);
export default prisma;

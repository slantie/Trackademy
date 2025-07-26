/**
 * @file src/config/database.ts
 * @description Database configuration and Prisma client initialization
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'CLIENT',
        input: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    generateId: () => undefined,
  },
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 60,
    max: 10,
    customRules: {
      '/api/auth/sign-in/email': {
        window: 60,
        max: 5,
      },
      '/api/auth/sign-up/email': {
        window: 60,
        max: 3,
      },
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

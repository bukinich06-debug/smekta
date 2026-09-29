import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { dbClient } from '@/data/shared/dbClient';

export const auth = betterAuth({
  database: prismaAdapter(dbClient, {
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
    database: {
      generateId: 'serial',
    },
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

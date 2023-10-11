import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
  server: {
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: z.string().min(1).optional(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  },
  runtimeEnv: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
});

import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: `.env.local`, override: true });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL! + "?sslmode=require",
  },
} satisfies Config;

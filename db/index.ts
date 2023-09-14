import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const queryClient = postgres(DATABASE_URL);

const db: PostgresJsDatabase = drizzle(queryClient);

export default db;

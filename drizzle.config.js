import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./src/models/*",   // path to your Drizzle table definitions
  out: "./drizzle",           // folder for migration files
  
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, // Supabase Postgres URL
  },
});

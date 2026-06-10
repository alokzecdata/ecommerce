// src/config/db.js
import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';

// Create a connection pool to Supabase Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // stored in .env
});

// Initialize Drizzle ORM with the pool
const db = drizzle(pool);

export { db, pool };

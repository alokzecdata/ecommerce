import { pgTable, serial, varchar, integer, numeric, timestamp } from "drizzle-orm/pg-core";

// Define the Product table schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  category: varchar("category", { length: 100 }),
  image_url: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

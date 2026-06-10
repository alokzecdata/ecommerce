import { pgTable, serial, integer, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import users from "./user.js";
import { products } from "./product.js";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, shipped, cancelled
  total: numeric("total", { precision: 10, scale: 2 }).default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // snapshot of product price
});

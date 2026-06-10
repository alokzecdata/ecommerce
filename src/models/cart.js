import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { users } from "./user.js";
import { products } from "./product.js";

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

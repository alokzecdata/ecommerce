import { db } from "../config/db.js";
import { cart } from "../models/cart.js";
import { products } from "../models/product.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const [product] = await db.select().from(products).where(products.id.eq(productId));
    if (!product) return res.status(404).json({ message: "Product not found" });

    const [existing] = await db
      .select()
      .from(cart)
      .where(cart.userId.eq(req.user.id))
      .where(cart.productId.eq(productId));

    if (existing) {
      // update quantity
      const [updated] = await db
        .update(cart)
        .set({ quantity: existing.quantity + quantity })
        .where(cart.id.eq(existing.id))
        .returning();
      return res.json(updated);
    }

    const [newItem] = await db
      .insert(cart)
      .values({ userId: req.user.id, productId, quantity })
      .returning();

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// View cart
export const getCart = async (req, res) => {
  try {
    const items = await db.select().from(cart).where(cart.userId.eq(req.user.id));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const [deleted] = await db
      .delete(cart)
      .where(cart.userId.eq(req.user.id))
      .where(cart.productId.eq(parseInt(req.params.productId)))
      .returning();

    if (!deleted) return res.status(404).json({ message: "Item not found in cart" });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import { db } from "../config/db.js";
import { orders, orderItems } from "../models/order.js";
import { products } from "../models/product.js";

// Create new order
export const checkout = async (req, res) => {
  try {
    const cartItems = await db.select().from(cart).where(cart.userId.eq(req.user.id));
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    let total = 0;
    for (const item of cartItems) {
      const [product] = await db.select().from(products).where(products.id.eq(item.productId));
      total += parseFloat(product.price) * item.quantity;
    }

    const [newOrder] = await db.insert(orders).values({
      userId: req.user.id,
      total,
      status: "pending",
    }).returning();

    for (const item of cartItems) {
      const [product] = await db.select().from(products).where(products.id.eq(item.productId));
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // clear cart after checkout
    await db.delete(cart).where(cart.userId.eq(req.user.id));

    res.status(201).json({ message: "Order created from cart", order: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userOrders = await db.select().from(orders).where(orders.userId.eq(req.user.id));
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(orders.id.eq(parseInt(req.params.id)))
      .returning();

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

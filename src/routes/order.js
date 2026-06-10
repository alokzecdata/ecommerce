import express from "express";
import {
  checkout,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

// User routes
router.post("/", authMiddleware, checkout);
router.get("/", authMiddleware, getUserOrders);

// Admin routes
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;

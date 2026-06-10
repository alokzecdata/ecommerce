import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from "../controller/productController.js";
import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/add",  authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.put("/update/:id",  authMiddleware, adminMiddleware, updateProduct);
router.delete("/delete/:id",  authMiddleware, adminMiddleware, deleteProduct);

export default router;
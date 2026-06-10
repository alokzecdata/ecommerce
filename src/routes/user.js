import {getUsers, getUserById, getProfile, markAdmin, updateProfile, deleteUser, loginUser, signupUser} from "../controller/userController.js";
import express from "express";
const router = express.Router(); 
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";



router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/mark-admin/:id", authMiddleware, adminMiddleware, markAdmin);

export default router;
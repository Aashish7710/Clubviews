import express from "express";
import { register, login, logout, verify2FA, getMe, forgotPassword } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Registration endpoints
router.post("/register", register);
router.post("/register/student", register);

// Login endpoints
router.post("/login", login);
router.post("/login/student", login);
router.post("/login/admin", login);

// Password recovery
router.post("/forgot-password", forgotPassword);

// 2FA verification
router.post("/verify-2fa", verify2FA);

// Profile endpoint
router.get("/me", verifyToken, getMe);

// Logout endpoint
router.post("/logout", logout);

export default router;
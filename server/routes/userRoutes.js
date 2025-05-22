import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // middelwares
import { registerUser } from "../controllers/authController.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

// ======================================

const router = express.Router(); // ایجاد یک روت جدید

router.post("/register", registerUser);
// ======================================================================
// یک روت تستی برای گرفتن پروفایل کاربر (محافظت شده)

// GET /api/users/profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// router.post('/login', loginUser);

export default router;

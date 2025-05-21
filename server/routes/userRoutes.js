import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // middelwares
import { registerUser } from '../controllers/authController.js';

// ======================================

const router = express.Router(); // ایجاد یک روت جدید

router.post("/register", registerUser);
// ======================================================================
// یک روت تستی برای گرفتن پروفایل کاربر (محافظت شده)

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    // به لطف میان افزار protect، اینجا به req.user دسترسی داریم
    if (req.user) {
      res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName,
        bio: req.user.bio,
        profilePicture: req.user.profilePicture,
        isAdmin: req.user.isAdmin,
        savedImages: req.user.savedImages,
        message: "اطلاعات پروفایل کاربر با موفقیت دریافت شد."
      });
    } else {
      // این حالت نباید اتفاق بیفته اگر protect درست کار کنه
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  });

// router.post('/login', loginUser);

export default router;






















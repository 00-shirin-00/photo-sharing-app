import express from "express";
import {
    loginUser,
  registerUser 
} from "../controllers/authController.js";
// ======================================
const router = express.Router();
// روت ثبت نام
router.post("/register", registerUser);
// روت ورود
router.post('/login', loginUser);

export default router;

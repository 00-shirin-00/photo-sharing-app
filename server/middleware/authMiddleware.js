// server/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; //  اطلاعات کامل کاربر رو بگیریم

const protect = async (req, res, next) => {
  let token;

  // 1. خواندن توکن از هدر Authorization
  // توکن معمولا به صورت "Bearer [tokenstring]" ارسال میشه
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. استخراج خود توکن (بدون کلمه 'Bearer')
      token = req.headers.authorization.split(" ")[1];

      // 3. اعتبارسنجی توکن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // jwt.verify توکن رو با سکرت کی ما چک میکنه، اگر نامعتبر باشه خودش خطا پرتاب میکنه

      // 4. گرفتن اطلاعات کاربر از دیتابیس با ID موجود در توکن
      // و اضافه کردنش به آبجکت req (بدون پسورد)
      // این کار باعث میشه در روت های بعدی به req.user دسترسی داشته باشیم
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "کاربر یافت نشد، مجوز دسترسی وجود ندارد." });
      }

        next();
    
    } catch (error) {
      console.error("خطا در اعتبارسنجی توکن:", error.message);
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "توکن نامعتبر است، مجوز دسترسی وجود ندارد." });
      }
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "توکن منقضی شده است، لطفا دوباره وارد شوید." });
      }
      return res
        .status(401)
        .json({ message: "مجوز دسترسی وجود ندارد، مشکل در توکن." });
    }
  }

  if (!token) {
    // اگر هیچ توکنی در هدرها نبود
    res
      .status(401)
      .json({ message: "مجوز دسترسی وجود ندارد، توکنی یافت نشد." });
  }
};



export { protect };

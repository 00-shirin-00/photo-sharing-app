import express from 'express'; 
import dotenv from "dotenv";
import cors from "cors";

// ------pages----------------------------
import connectDB from "./config/db.js";//تابع اتصال به دیتابیس
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // erroe middlewares

// ===========================================
// این خط متغیرهای .env رو بارگذاری می کنه
dotenv.config();


// اتصال به دیتابیس MongoDB
connectDB();


//  ایجاد یک نمونه (instance) از اپلیکیشن Express
const app = express();

// -------------------------------------------------
app.use(cors()); // before all routes
//-----------------------------------------------------------------

//express.json(): این میان‌افزار بدنه درخواست‌هایی که با Content-Type: application/json ارسال میشن رو پارس می‌کنه و نتیجه رو در req.body قرار میده.
//برای پارس کردن JSON در بدنه درخواست
app.use(express.json());

//-----------------------------------------------------------------
//express.urlencoded({ extended: true }): این میان‌افزار بدنه درخواست‌هایی که با Content-Type: application/x-www-form-urlencoded (مثل فرم‌های HTML سنتی) ارسال میشن رو پارس می‌کنه.
//برای پارس کردن داده های فرم (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// تعریف روت ها -------------------------------

// . تعریف یک روت (مسیر) اصلی
app.get('/', (req, res) => {
  res.send('hey you... im here... wher are you?');
});

// اتصال روت های احراز هویت
app.use('/api/auth', authRoutes);

app.use("/api/users", userRoutes); 


// erroe middlewares >> ===============================================================
app.use(notFound);       // برای مسیرهای یافت نشده (404)
app.use(errorHandler);   // برای سایر خطاها
// ===============================================================



// . تعریف یک پورت برای سرور
const PORT = process.env.PORT || 3001;


// . راه اندازی سرور و گوش دادن به درخواست ها روی پورت مشخص شده
app.listen(PORT, () => {
  console.log(` run on server ${PORT} `);
});






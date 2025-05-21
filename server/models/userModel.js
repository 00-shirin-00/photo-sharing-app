import mongoose from "mongoose";

// ====================================

// 1. تعریف Schema (ساختار) برای کاربر
const userSchema = new mongoose.Schema(
  {
    // نام کاربری
    username: {
      type: String,
      required: [true, "نام کاربری اجباری است"], // [مقدار, پیام خطا در صورت عدم وجود]
      unique: true, // نام کاربری باید یکتا باشد
      trim: true, // فضاهای خالی اول و آخر رشته رو حذف می کنه
      minlength: [3, "نام کاربری باید حداقل ۳ کاراکتر باشد"],
      maxlength: [30, "نام کاربری نباید بیشتر از ۳۰ کاراکتر باشد"],
    },

    // ایمیل
    email: {
      type: String,
      required: [true, "ایمیل اجباری است"],
      unique: true,
      trim: true,
      lowercase: true, // ایمیل رو به حروف کوچک تبدیل می کنه
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "لطفا یک ایمیل معتبر وارد کنید",
      ],
    },

    // رمز عبور
    password: {
      type: String,
      required: [true, "رمز عبور اجباری است"],
      minlength: [6, "رمز عبور باید حداقل ۶ کاراکتر باشد"],
      select: false, // این فیلد در زمان دریافت اطلاعات کاربر نمایش داده نمی شود
    },

    //نام کاربر در بایو

    displayName: {
      type: String,
      trim: true,
      maxlength: [50, "نام نمایشی نمی تواند بیشتر از ۵۰ کاراکتر باشد."],
    },

    // عکس پروفایل (آدرس عکس یا شناسه فایل)
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile-picture.jpg", // آدرس عکس پیش فرض
    },

    // بیوگرافی یا توضیحات کاربر
    bio: {
      type: String,
      trim: true,
      maxlength: [200, "بیوگرافی نباید بیشتر از ۲۰۰ کاراکتر باشد"],
    },

    // عکس هایی که کاربر آپلود کرده (آرایه ای از ID عکس ها)
    savedImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image", // ارجاع به مدل عکس
      },
    ],

    // آیا کاربر ادمین است؟ (برای آینده، اگر لازم شد)
    isAdmin: {
      type: Boolean,
      default: false, // به طور پیش فرض کاربر ادمین نیست
    },
  },
  {
    // 2. تنظیمات Schema (اختیاری)
    // به طور خودکار فیلدهای createdAt و updatedAt رو اضافه و مدیریت می کنه
    timestamps: true, // تاریخ و زمان ایجاد و به روز رسانی رکوردها را ذخیره می کند
  }
);

// 3. (بعداً اضافه می کنیم) میان افزار (Middleware) برای هش کردن پسورد قبل از ذخیره
// userSchema.pre('save', async function(next) { ... });

// 4. ایجاد Model از روی Schema
// 'User' نامی هست که برای این مدل در نظر می گیریم. Mongoose به طور خودکار این نام رو
// به صورت جمع و با حروف کوچک برای نام کالکشن در دیتابیس استفاده می کنه (مثلا 'users')

// mongoose.model('نام مدل', schema مربوطه, 'نام کالکشن در دیتابیس (اختیاری)')
// اگر نام کالکشن رو ندیم، Mongoose خودش از روی نام مدل (User -> users) می سازه

const User = mongoose.model("User", userSchema);

// 5. خروجی گرفتن از Model
export default User;

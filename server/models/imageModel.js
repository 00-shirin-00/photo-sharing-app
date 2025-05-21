import mongoose from "mongoose";

// ======================================
const imageSchema = new mongoose.Schema(
  //عنوان عکس
  {
    title: {
      type: String,
      trim: true,
      maxlength: [100, "عنوان عکس نباید بیشتر از ۱۰۰ کاراکتر باشد"],
    },
    // توضیحات عکس
    description: {
      type: String,
      trim: true,
      maxlength: [500, "توضیحات عکس نباید بیشتر از ۵۰۰ کاراکتر باشد"],
    },
    // آدرس عکس
    imageUrl: {
      type: String,
      required: [true, "آدرس عکس اجباری است"],
    },
    //حجم فایل به بایت
    size: {
      type: Number,
    },

    //دسته بندی عکس
    category: {
      type: String,
      //   enum: ["Nature", "Animals", "Technology", "People", "Food", "Other"],
      trim: true,
      lowercase: true,
      // اگر بخواهیم یک پیام خطای سفارشی برای enum بدیم:
      enum: {
        values: ["nature", "animals", "technology", "people", "food", "other"],
        message: '{VALUE} به عنوان دسته بندی پشتیبانی نمی شود.'
      },
      default: "Other",
    },
    // تگ های مربوط به عکس (آرایه ای از رشته ها)
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    //سازنده
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "سازنده عکس اجباری است"],
    },

    // تعداد لایک ها (اختیاری، اگر قابلیت لایک داشته باشیم)
    // likesCount: {
    //   type: Number,
    //   default: 0,
    // },

    // کاربرانی که این عکس را لایک کرده اند (اگر بخواهیم لیستشون رو نگه داریم)
    // likedBy: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ],

    // تعداد بازدیدها (اختیاری)
    // viewsCount: {
    //   type: Number,
    //   default: 0,
    // },

    // آیا عکس خصوصی است یا عمومی (فعلا همه عمومی هستند طبق تعریف پروژه)
    // isPrivate: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  {
    timestamps: true, // فیلدهای createdAt و updatedAt رو خودکار اضافه می کنه
  }
);

const Image = mongoose.model("Image", imageSchema);
export default Image;

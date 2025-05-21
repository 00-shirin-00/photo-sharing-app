import User from "../models/userModel.js"; // مدل User
import bcrypt from "bcryptjs"; // برای هش کردن پسورد
import jwt from "jsonwebtoken"; // برای ایجاد توکن JWT 

// =========================================

// تابع برای ساخت توکن JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // JWT_SECRET رو باید در فایل .env تعریف کنی
    expiresIn: "30d", // مدت اعتبار توکن، مثلا ۳۰ روز
  });
};

// ===================================
//register >>

export const registerUser = async (req, res) => {
  // 1. گرفتن داده ها از بدنه درخواست (request body)
  const { username, email, password, displayName, bio, profilePicture } =
    req.body;

  try {
    // 2. اعتبارسنجی اولیه داده های ورودی (می توان کامل تر هم کرد)
    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          "لطفا تمام فیلدهای الزامی را پر کنید (نام کاربری، ایمیل، رمز عبور).",
      }); // Bad Request
    }
    // -------------------------------------------------------------
    // 3. بررسی اینکه آیا کاربر با این username یا email از قبل وجود دارد یا نه

    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res
        .status(400)
        .json({ message: "کاربری با این ایمیل قبلا ثبت نام کرده است." });
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      return res
        .status(400)
        .json({ message: "این نام کاربری قبلا استفاده شده است." });
    }
    // -------------------------------------------------------------

    // 4. هش کردن رمز عبور قبل از ذخیره سازی
    const salt = await bcrypt.genSalt(10); // ایجاد یک "نمک" برای افزایش امنیت هش

    const hashedPassword = await bcrypt.hash(password, salt);
    // -------------------------------------------------------------

    // 5. ایجاد یک کاربر جدید
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      displayName: displayName || username, // اگر displayName نبود، از username
      bio: bio || "",
      profilePicture: profilePicture || "",
    });
    // -------------------------------------------------------------

    if (user) {
      // 6. ایجاد توکن JWT و ارسال پاسخ
      const token = generateToken(user._id);
      res.status(201).json({
        // 201 یعنی "Created"
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
        bio: user.bio,
        token: token, // توکن رو هم می فرستیم
        message: "ثبت نام با موفقیت انجام شد.",
      });
    } else {
      res.status(400).json({
        message: "اطلاعات کاربر نامعتبر است یا خطایی در ساخت کاربر رخ داده.",
      });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res
      .status(500)
      .json({
        message: "خطایی در سرور رخ داده است. لطفا بعدا تلاش کنید.",
        error: error.message,
      });
  }
};





// =========================================================
// تابع جدید برای ورود کاربر login >>

export const loginUser = async (req, res) => {
  // 1. دریافت اطلاعات از بدنه درخواست
  const { username, password } = req.body;

  try {
    // 2. اعتبارسنجی اولیه
    if (!username || !password) {
      return res.status(400).json({ message: "    // 2. اعتبارسنجی اولیه." });
    }

    // 3. پیدا کردن کاربر در دیتابیس (با ایمیل یا نام کاربری)
    // با توجه به اینکه ایمیل را با حروف کوچک ذخیره کرده ایم، اینجا هم جستجو را با حروف کوچک انجام می دهیم
    const user = await User.findOne({
      $or: [
        { email: String(username).toLowerCase() }, // تبدیل به رشته و سپس حروف کوچک
        { username: username },
      ],
    }).select("+password"); // <--- خیلی مهم: پسورد رو هم از دیتابیس برگردون برای مقایسه
                            // چون در مدل select: false زدیم

    // 4. بررسی وجود کاربر
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // 5. مقایسه پسورد ارسال شده با پسورد هش شده در دیتابیس
    const isMatch = await bcrypt.compare(password, user.password);

    // 6. بررسی صحت پسورد
    if (!isMatch) {
      return res.status(401).json({ message: '.    // 6. بررسی صحت پسورد' });
    }

    // اگر کاربر وجود داشت و پسورد هم صحیح بود
    // 7. ایجاد توکن JWT
    const token = generateToken(user._id);

    // 8. ارسال پاسخ (بدون پسورد)
    res.status(200).json({ // 200 یعنی OK
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isAdmin: user.isAdmin,
      savedImages: user.savedImages,
      token: token,
      message: 'successfully logged in',
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'خطایی در سرور هنگام ورود کاربر رخ داده است.' });
  }
};
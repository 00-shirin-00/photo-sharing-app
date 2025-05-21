import { createSlice } from "@reduxjs/toolkit";

// تلاش برای خواندن اطلاعات کاربر از localStorage در زمان بارگذاری اولیه
// این کار باعث میشه اگر کاربر قبلا لاگین کرده و صفحه رو رفرش کرده، وضعیت لاگینش حفظ بشه
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? //یعنی کاربر قبلاً لاگین کرده و صفحه رفرش شده)، اون رو به عنوان مقدار اولیه قرار میده
    JSON.parse(localStorage.getItem("userInfo"))
  : null;

// وضعیت (state) اولیه برای این slice
const initialState = {
  userInfo: userInfoFromStorage, // اطلاعات کاربر (شامل توکن)
  isLoading: false, // برای عملیات ناهمزمان مثل لاگین/ثبت نام
  error: null, // برای نگهداری پیام خطا
};
// ----------------------------------------------------------------------------
const authSlice = createSlice({
  name: "auth", // یک نام برای این slice، در Redux DevTools استفاده میشه
  initialState, // وضعیت اولیه که در بالا تعریف کردیم
  reducers: {
    // تعریف reducer ها (و action creator های متناظرشون که به طور خودکار ساخته میشن)
    //هر تابعی که در ابجکت ردیوسر تعریف میکنیم یک اکشن هم به طور خودکار برای اون ساخته میشه
    //هر تابعی که در ابجکت ردیوسر تعریف میکنیم یک create slice در case reducer است که فقط برای یک نوع اکشن خاص که از اسم تابع گرفته میشه اجرا میشه

      //createSlices >>---------------------------------
      
    // اکشن برای زمانی که درخواست لاگین/ثبت نام شروع میشه
    authRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // اکشن برای زمانی که لاگین/ثبت نام موفقیت آمیز است
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload; // payload شامل اطلاعات کاربر و توکن خواهد بود
      state.error = null;
      // ذخیره اطلاعات کاربر در localStorage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    // اکشن برای زمانی که لاگین/ثبت نام با خطا مواجه میشه
    authFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // payload شامل پیام خطا خواهد بود
      state.userInfo = null; // در صورت خطا، اطلاعات کاربر رو پاک می کنیم
    },

    // اکشن برای لاگ اوت کاربر
    logout: (state) => {
      state.userInfo = null;
      state.isLoading = false;
      state.error = null;
      // پاک کردن اطلاعات کاربر از localStorage
      localStorage.removeItem("userInfo");
    },

    // (اختیاری) اکشنی برای پاک کردن پیام خطا
    //مثلاً وقتی کاربر شروع به تایپ مجدد در فرم می‌کنه
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  // برای action های ناهمزمان که با createAsyncThunk ساخته میشن، از extraReducers استفاده می کنیم
  // فعلا ما action های ناهمزمان رو مستقیما از کامپوننت با dispatch مدیریت می کنیم
  // یا بعدا از RTK Query استفاده خواهیم کرد.
  // extraReducers: (builder) => {
  //   // builder.addCase(...)
  // }
});

// استخراج action creator ها از slice
export const { authRequest, authSuccess, authFail, logout, clearAuthError } =
  authSlice.actions;

// استخراج reducer از slice
export default authSlice.reducer;

// (اختیاری) ساخت Selector ها برای دسترسی راحت تر به بخش هایی از state
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectIsLoggedIn = (state) => !!state.auth.userInfo; // تبدیل userInfo به boolean
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

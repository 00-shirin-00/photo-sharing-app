import { configureStore } from "@reduxjs/toolkit";
//configureStore: این تابع از @reduxjs/toolkit هست و کار ساخت store رو خیلی راحت می‌کنه.
// configureStore به طور خودکار Redux DevTools رو در حالت توسعه فعال می کنه
// و همچنین Thunk middleware رو هم اضافه می کنه که برای action های ناهمزمان لازم میشه.
//   ---------------------------------------------------------
import authReducer from '../features/auth/authSlice.js'; //ایمپورت authSlice از authSlice.js
// =====================================================
export const store = configureStore({
  reducer: {
    //reducer: یک آبجکت هست که "reducer" های مختلف اپلیکیشن رو نگهداری می‌کنه. هر reducer مسئول مدیریت یک بخش (slice) از state کلی اپلیکیشن هست

    auth: authReducer, // اینجا authSlice رو به store اضافه می‌کنیم
  },
});
export default store;

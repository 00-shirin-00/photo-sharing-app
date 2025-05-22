// client/src/api.js
import axios from "axios";
import store from "./store/store"; // برای دسترسی به state و توکن

const api = axios.create({
  baseURL: "/api", // آدرس پایه API (با فرض تنظیم پراکسی در Vite)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: برای اضافه کردن توکن به هدر تمام درخواست ها
api.interceptors.request.use(
  (config) => {
    const { userInfo } = store.getState().auth; // گرفتن userInfo از Redux store
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (اختیاری) Response Interceptor: برای مدیریت خطاهای ۴۰۱ سراسری یا موارد دیگه
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // اگر خطای ۴۰۱ بود، کاربر رو لاگ اوت کن و به صفحه لاگین بفرست
//       // store.dispatch(logout()); // logout رو باید از authSlice ایمپورت کنی
//       // window.location.href = '/login'; // یا با useNavigate اگر در کامپوننت بودی
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

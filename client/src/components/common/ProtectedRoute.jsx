import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
//auth-------------
import {
  selectIsLoggedIn,
  selectAuthLoading,
} from "../../features/auth/authSlice";

// ============================================
const ProtectedRoute = () => {
  //selectors >>
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoadingAuth = useSelector(selectAuthLoading);

  // برای ذخیره مسیری که کاربر می خواست بره----------
  const location = useLocation();

  // اگر در حال لودینگ اولیه برای چک کردن توکن از localStorage هستیم
  if (isLoadingAuth && !isLoggedIn) {
    return <div>loading....loading</div>;
  }

  // اگر کاربر لاگین نکرده و وضعیت لودینگ هم تمام شده
  if (!isLoggedIn && !isLoadingAuth) {
    //وقتی replace رو بذاری:
    // مسیر قبلی (مثلاً /dashboard) از history حذف می‌شه.
    // یعنی وقتی کاربر لاگین کرد و رفت به /dashboard، اگه دکمه Back مرورگر رو بزنه، دیگه برنمی‌گرده به /login.
    return <Navigate to="/login" state={{ form: location }} replace />;
    //   به این معنیه >>:
    // "کاربر لاگین نیست → بفرستش به /login → آدرس فعلیش رو هم با خودش ببر تا بعداً برگرده همین‌جا → لاگ هم ننداز در history مرورگر."
  }

  return <Outlet />;
};
export default ProtectedRoute;
// اگر می‌خوای بعداً (مثلاً با زدن دکمه، بعد از لاگین، یا شرط خاصی) تغییر مسیر بدی → از useNavigate() استفاده کن.


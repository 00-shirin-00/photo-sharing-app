import React, { useState } from "react";
//redux >>
import { useSelector } from "react-redux";
//selectors >>
import {
  selectCurrentUser,
  selectIsLoggedIn,
  selectIsLoading,
  selectIsError,
  clearAuthError,
  authRequest,
} from "../features/auth/authSlice";

//router >>
import { Navigate } from "react-router-dom";
// =============================================================

const ProfilePage = () => {
  //redux >>
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectIsError);

  //To control the display of the edit form.
  const [isEditMode, setIsEditMode] = useState(false);

  //for the edit form
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    // profilePicture: '',
  });

  // وقتی کامپوننت لود میشه یا currentUser تغییر می کنه، formData رو با اطلاعات کاربر پر کن
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
        // profilePicture: currentUser.profilePicture || '',
      });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [currentUser, dispatch]);

  // اگر هنوز در حال لود اولیه نیست و لاگین هم نکرده
  if(!isLoading && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // اگر در حال لود اولیه هستیم
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  //handle change>>
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    //errror handling
    if (error) {
      dispatch(clearAuthError());
    } 
  };
  //handle submit>>
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authRequest());// برای شروع درخواست
    try {
      // اینجا می‌تونید درخواست آپدیت پروفایل رو به سرور بزنید
      const API_URL = "/api/users/profile"; // آدرس API
      const config = {
        headers: {
          "Content-Type": "application/json",

          //  توکن در Redux store (currentUser.token) هست و از اونجا می خونیم

          Authorization: `Bearer ${currentUser.token}`, // توکن کاربر
        },
      };
      // فیلدهایی که می خوایم آپدیت بشن
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
        // profilePicture: formData.profilePicture,
      };
      const response = await axios.put(API_URL, updateData, config);

    }



  // if (!currentUser && isLoggedIn) {
  //   // اگر لاگین هستیم ولی هنوز اطلاعات کاربر کامل نیست
  //   return <div>در حال بارگذاری اطلاعات کاربر...</div>;
  // }

  // if (!currentUser && !isLoggedIn) {
  //   // این حالت با ProtectedRoute نباید اتفاق بیفته
  //   return <Navigate to="/login" replace />;
  // }
  //////////////////////////////////////////////////////////////
  return (
    <div style={{ padding: "20px" }}>
      <h2>پروفایل کاربر</h2>
      <p>
        <strong>نام کاربری:</strong> {currentUser.username}
      </p>
      <p>
        <strong>ایمیل:</strong> {currentUser.email}
      </p>
      <p>
        <strong>نام نمایشی:</strong> {currentUser.displayName || "وارد نشده"}
      </p>
      <p>
        <strong>بیوگرافی:</strong> {currentUser.bio || "وارد نشده"}
      </p>
      {currentUser.profilePicture && (
        <div>
          <p>
            <strong>عکس پروفایل:</strong>
          </p>
          <img
            src={currentUser.profilePicture}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

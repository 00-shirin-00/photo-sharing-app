import React, { useEffect, useState } from "react";
//redux >>
import { useDispatch, useSelector } from "react-redux";
//selectors >>
import {
  selectCurrentUser,
  selectIsLoggedIn,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
  authRequest,
  authSuccess,
  authFail,
} from "../features/auth/authSlice";

//router >>
import { Navigate } from "react-router-dom";
import api from "../utils/api";
// =============================================================

const ProfilePage = () => {
  //redux >>
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // states -----------------------------------------
  //To control the display of the edit form or profile information
  const [isEditing, setIsEditing] = useState(false); // برای کنترل نمایش فرم ویرایش
  //to store the values of the edite form
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    // profilePicture: '',
  });
  // -----------------------------------------------------
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
  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // اگر در حال لود اولیه هستیم
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  //handle change>>------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearAuthError());
    }
  };
  //handle edit toggle>>------------------------------
  // این تابع برای تغییر حالت ویرایش استفاده میشه
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && currentUser) {
      // اگر از حالت ویرایش خارج میشیم، فرم رو با اطلاعات فعلی ریست کن
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
      });
      dispatch(clearAuthError()); // خطاهای احتمالی ویرایش رو هم پاک کن
    }
  };

  //handle submit>>------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authRequest()); // برای شروع درخواست
    try {
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

      
      // توکن به صورت خودکار به هدر اضافه می‌شود (نیازی به config نیست).
      const response = await api.put(API_URL, updateData);
      // بعد از آپدیت موفق، اطلاعات کاربر در Redux store رو با اطلاعات جدید آپدیت کن
      // response.data باید شامل اطلاعات آپدیت شده کاربر باشه
      // ما همچنین باید توکن قبلی رو هم به آبجکت جدید اضافه کنیم چون API آپدیت، توکن جدید برنمیگردونه

      console.log(response.data);

      dispatch(
        authSuccess({
          ...response.data,
          token: currentUser.token,
        })
      );

      // بعد از آپدیت موفق، می‌تونید حالت ویرایش رو خاموش کنید
      setIsEditMode(false);


    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred while updating the profile.";

      dispatch(authFail(errorMessage)); // dispatch اکشن خطا
    }
  };

  //////////////////////////////////////////////////////////////
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        marginTop: "10px",
        border: "black solid 2px",
        borderRadius: "20px",
        lineHeight: "35px",
      }}
    >
      <h2>پروفایل کاربر</h2>
      {isLoading && <p>در حال به‌روزرسانی...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {isEditing ? (
        // فرم ویرایش
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label htmlFor="displayName">نام نمایشی =</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div>
            <label htmlFor="bio">بیوگرافی:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                minHeight: "80px",
              }}
            />
          </div>
          {/* آپلود عکس پروفایل بعدا اضافه میشه */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
              }}
            >
              {isLoading ? "ذخیره سازی..." : "ذخیره تغییرات"}
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
              }}
            >
              انصراف
            </button>
          </div>
        </form>
      ) : (
        // نمایش اطلاعات
        <div>
          <p>
            <strong>نام کاربری : </strong> {currentUser.username}
          </p>
          <p>
            <strong>ایمیل : </strong> {currentUser.email}
          </p>
          <p>
            <strong>نام نمایشی : </strong>{" "}
            {currentUser.displayName || "هنوز وارد نشده"}
          </p>
          <p>
            <strong>بیوگرافی : </strong> {currentUser.bio || "هنوز وارد نشده"}
          </p>
          {currentUser.profilePicture && (
            <div style={{ marginTop: "10px" }}>
              <p>
                <strong>عکس پروفایل:</strong>
              </p>
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <button
            onClick={handleEditToggle}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
            }}
          >
            ویرایش پروفایل
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

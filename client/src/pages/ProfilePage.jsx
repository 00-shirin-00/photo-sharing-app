import React, { useEffect, useState, useRef } from "react";
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
import { Navigate, useNavigate } from "react-router-dom";
// api >>
import api from "../utils/api";
// =============================================================

const ProfilePage = () => {
  //redux >>--------------------
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // navigate >>----------------------
  const navigate = useNavigate();

  // useRef >>----------------------
  const imgRef = useRef(null); // برای دسترسی به input فایل عکس پروفایل
  const previewCanvasRef = useRef(null); // برای پیش نمایش عکس کراپ شده

  // states -----------------------------------------
  //To control the display of the edit form or profile information
  const [isEditing, setIsEditing] = useState(false); // برای کنترل نمایش فرم ویرایش
  //to store the values of the edite form
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    // profilePicture: '',
  });

  // To control the display of the profile picture modal>>
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  // To store the selected profile picture file>>
  const [upimg, setUpimg] = useState(null); //before cropping
  const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 / 1 }); //firs crop data
  const [completedCrop, setCompletedCrop] = useState(null); //after cropping

  // useEffect -----------------------------------------------------
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
      // هنگام ورود به صفحه یا unmount شدن، خطای قبلی را پاک کن
      dispatch(clearAuthError());
    };
  }, [currentUser, dispatch]);

  //conditions => ===========================================================
  // اگر در حال لود اولیه هستیم
  if (isLoading && !currentUser && !isLoggedIn) {
    return <div>در حال بارگذاری...</div>;
  }
  // اگر هنوز در حال لود اولیه نیست و لاگین هم نکرده
  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (!currentUser) {
    return (
      <div>
        در حال بارگذاری اطلاعات کاربر... (ممکن است نیاز به fetch مجدد باشد)
      </div>
    );
  }
  //handling => ===========================================================
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
      const API_URL = "/users/profile"; // آدرس API
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",

      //     //  توکن در Redux store (currentUser.token) هست و از اونجا می خونیم
      //     Authorization: `Bearer ${currentUser.token}`, // توکن کاربر
      //   },
      // };
      // فیلدهایی که می خوایم آپدیت بشن
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
        // profilePicture: formData.profilePicture,
      };
      console.log("فیلدهایی که می خوایم آپدیت بش", updateData);
      // توکن به صورت خودکار به هدر اضافه می‌شود (نیازی به config نیست).
      const response = await api.patch(API_URL, updateData);
      // بعد از آپدیت موفق، اطلاعات کاربر در Redux store رو با اطلاعات جدید آپدیت کن
      // response.data باید شامل اطلاعات آپدیت شده کاربر باشه
      // ما همچنین باید توکن قبلی رو هم به آبجکت جدید اضافه کنیم چون API آپدیت، توکن جدید برنمیگردونه

      console.log("اطلاعات کاربرbefor", response.data);
      console.log("current before update", currentUser);
      dispatch(
        authSuccess({
          ...currentUser,
          ...response.data,
          token: currentUser.token,
        })
      );
      console.log("current after update", currentUser);
      console.log("اطلاعات کاربرafter", response.data);

      // بعد از آپدیت موفق، می‌تونید حالت ویرایش رو خاموش کنید
      setIsEditing(false);
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred while updating the profile.";

      dispatch(authFail(errorMessage)); // dispatch اکشن خطا
    }
  };

  //handle img upload>>------------------------------------
  // این تابع برای باز کردن مودال آپلود عکس پروفایل استفاده میشه
  const handleProfilePicChangeClick = () => {
    setShowProfilePicModal(true);
  };

  // این تابع برای بستن مودال آپلود عکس پروفایل استفاده میشه
  const handleCloseProfilePicModal = () => {
    setShowProfilePicModal(false);
    setUpimg(null); // reset the image
    setCompletedCrop(null); // reset the crop
  };

  // این تابع برای انتخاب عکس پروفایل استفاده میشه
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // اگر فایلی انتخاب شده باشد
      const reader = new FileReader(); // برای خواندن فایل
      reader.addEventListener("load", () => {
        setUpimg(reader.result); // فایل انتخاب شده را در state ذخیره کن
      });
      reader.readAsDataURL(e.target.files[0]); // فایل را به صورت Data URL بخوان
      e.target.value = null; // برای اینکه اگر کاربر دوباره همون فایل رو انتخاب کرد، onChange دوباره اجرا بشه
    }
  };

  // تابع برای آپلود عکس کراپ شده (بعدا تکمیل میشه)
  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !previewCanvasRef.current) {
      console.log("crop not completed or canvas not available");
      return; // اگر کراپ تکمیل نشده یا کانواس وجود ندارد، هیچ کاری نکن
    }

    // اینجا منطق تبدیل canvas به Blob و ارسال به سرور رو اضافه می کنیم
    console.log("uplosding cropped image logic will be here ...");
    // previewCanvasRef.current.toBlob(blob => { /* ارسال blob */ }, 'image/png', 0.8);
    handleCloseProfilePicModal(); // بستن مودال بعد از آپلود (یا تلاش برای آپلود)
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
      <h2>User ProFile </h2>
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
            <strong>username : </strong> {currentUser.username}
          </p>
          <p>
            <strong>email: </strong> {currentUser.email}
          </p>
          <p>
            <strong>displayName: </strong>
            {currentUser.displayName || "هنوز وارد نشده"}
          </p>
          <p>
            <strong>bio: </strong> {currentUser.bio || "هنوز وارد نشده"}
          </p>
          {/* div for profile pic >>--------------- */}
          <div
            style={{
              marginTop: "10px",
              position: "relative",
              width: "50%",
              height: "250px",
              // border: "2px solid #ccc",
            }}
          >
            <p>
              <strong>profile Picture :</strong>
            </p>
            <img
              src={
                currentUser.profilePicture || "https://via.placeholder.com/100"
              }
              // alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc",
                position: "absolute",
                bottom: "0",
                right: "0",
              }}
            />
            {/* button for change img >> */}
            <button
              onClick={handleProfilePicChangeClick}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              ✏️
            </button>
          </div>
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

      {/* Modal for profile picture upload >> */}
      {showProfilePicModal && (
        // a div for modal>>
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // برای اطمینان از اینکه مودال بالای همه چیز نمایش داده شود
          }}
        >
          {/* محتوای مودال */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <h3>آپلود عکس پروفایل</h3>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={imgRef}
              style={{ marginBottom: "10px" ,border: "1px solid #ccc", padding: "5px" }}
            />

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handleUploadCroppedImage}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#28a745",
                  color: "white",
                }}
              >
                save
              </button>
            </div>

            <button
              onClick={handleCloseProfilePicModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "5px 10px",
                border: "2px solid #ccc",
                color: "white",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

//hooks>>
import { useState, useEffect, useRef } from "react";
//redux >>
import { useSelector, useDispatch } from "react-redux";
// 📦 import کردن اکشن‌ها و selectors از redux slice مربوط به auth
import {
  selectCurrentUser,
  selectIsLoggedIn,
  authSuccess,
  authRequest,
  authFail,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from "../features/auth/authSlice";
//route >>
import { Navigate } from "react-router-dom";
// more >>
import axios from "axios";
//img crop>>
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // استایل‌های پیش‌فرض react-image-crop را وارد می‌کنیم

//styles >>
import styled from "styled-components";
import ProfileHeaderCard from "../components/profile/ProfileHeaderCard";
/////////////////////////////////////////////////////////////////////////////////
// style coomponent >>
const ProfilePageContainer = styled.div`
  min-height: calc(100vh - 60px); // 60px ارتفاع Navbar (باید دقیق تنظیم بشه)
  background-color: ${(props) =>
    props.theme.colors.neumorphismBackground ||
    "#e0e5ec"}; // رنگ پس زمینه اصلی برای Neumorphism
  padding: ${(props) => props.theme.spacings.large || "24px"};
  display: flex;
  flex-direction: column;
  align-items: center; // برای اینکه محتوا وسط چین باشه (اگر لازمه)
`;

// 📌 تابع کمکی برای محاسبه کراپ اولیه
//🔷 این تابع یک کراپ مربعی و وسط‌چین روی عکس تنظیم می‌کنه.
function centerAspectCropInPixels(mediaWidth, mediaHeight, aspect = 1) {
  const initialPercentage = 0.8; // اندازه اولیه کراپ را به صورت درصدی مشخص می‌کنیم
  const targetWidth =
    Math.min(mediaWidth, mediaHeight * aspect) * initialPercentage; // عرض هدف با توجه به نسبت و درصد
  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: targetWidth },
      aspect,
      mediaWidth,
      mediaHeight
    ), // کراپ را وسط‌چین می‌کند
    mediaWidth,
    mediaHeight
  );
}
////////////////////////////////////////////////////////////
const ProfilePage = () => {
  //redux -----------------------------------------------------------
  const dispatch = useDispatch(); // گرفتن تابع dispatch برای فرستادن اکشن‌ها به redux

  //selectors ------------------------------------------------------
  const currentUser = useSelector(selectCurrentUser); // گرفتن اطلاعات کاربر از redux
  const isLoggedIn = useSelector(selectIsLoggedIn); // بررسی لاگین بودن
  const isLoading = useSelector(selectAuthLoading); // بررسی وضعیت لودینگ
  const error = useSelector(selectAuthError); // بررسی وجود خطا

  //stats ----------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false); // مدیریت حالت ویرایش متن
  const [formData, setFormData] = useState({ displayName: "", bio: "" }); // داده‌های فرم ویرایش پروفایل
  const [showProfilePicModal, setShowProfilePicModal] = useState(false); // مدیریت نمایش مودال تغییر عکس
  const [upImg, setUpImg] = useState(null); // ذخیره عکس انتخاب شده برای کراپ
  const [crop, setCrop] = useState(); // وضعیت فعلی کراپ
  const [completedCrop, setCompletedCrop] = useState(null); // خروجی نهایی کراپ

  //ref -------------------------------------------------------------
  const imgRef = useRef(null); // ارجاع به المان img برای دسترسی مستقیم
  const previewCanvasRef = useRef(null); // ارجاع به المان canvas برای نمایش پیش‌نمایش

  //useEfect ========= Data =====================================
  // 📌 پر کردن اولیه فرم هنگام لود کاربر
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
      });
    }
    return () => dispatch(clearAuthError());
  }, [currentUser, dispatch]);

  //conditoins ---------------------------------------------------------
  // 📌 هدایت به صفحه لاگین اگر لاگین نشده باشد
  if (!isLoggedIn && !isLoading && !currentUser)
    return <Navigate to="/login" replace />;

  // 📌 نمایش پیام لودینگ اگر اطلاعات هنوز نیامده
  if (!currentUser) return <div>در حال بارگذاری اطلاعات کاربر...</div>;

  // اگر هنوز در حال بررسی هستیم (در حال لود شدن هستیم)
  if (isLoading) return <div>در حال بررسی وضعیت کاربر...</div>;

  // اگر کاربر لاگین نیست یا currentUser وجود نداره
  if (!isLoggedIn || !currentUser) return <Navigate to="/login" replace />;

  //Handles >> ============================================================
  // 📌 هندل تغییر مقادیر فرم
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearAuthError());
  };
  // ---------------
  // 📌 جابه‌جا کردن حالت ویرایش
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
      });
      dispatch(clearAuthError());
    }
  };
  // ----------------
  // 📌 ارسال تغییرات متنی به سرور
  const handleSubmitEditText = async (e) => {
    e.preventDefault();
    dispatch(authRequest());
    try {
      const response = await axios.patch(
        "/api/users/profile",
        {
          displayName: formData.displayName,
          bio: formData.bio,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(authSuccess({ ...response.data, token: currentUser.token }));
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "خطا در به‌روزرسانی پروفایل";
      dispatch(authFail(errorMessage));
    }
  };
  // ------------------
  // 📌 باز کردن مودال تغییر عکس
  const handleProfilePicChangeClick = () => setShowProfilePicModal(true);
  // -----------------
  // 📌 بستن مودال و پاک کردن داده‌ها
  const handleCloseProfilePicModal = () => {
    setShowProfilePicModal(false);
    setUpImg(null);
    setCrop(undefined);
    setCompletedCrop(null);
  };
  // ---------------------
  // 📌 وقتی کاربر فایل تصویر انتخاب می‌کند
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(String(reader.result)));
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };
  // -----------------
  // 📌 وقتی عکس در ReactCrop لود می‌شود کراپ اولیه تنظیم شود
  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
    imgRef.current = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const initialCrop = centerAspectCropInPixels(width, height, 1);
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
    }
  };
  // -------------------
  // 📌 رسم پیش‌نمایش کراپ شده روی canvas
  const drawCanvasPreview = (image, canvas, cropDataPx) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const previewSize = 300; // اندازه ثابت برای پیش‌نمایش (حل مشکل اندازه نادرست)
    canvas.width = previewSize;
    canvas.height = previewSize;
    ctx.save();
    ctx.beginPath();
    ctx.arc(previewSize / 2, previewSize / 2, previewSize / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      image,
      cropDataPx.x * scaleX,
      cropDataPx.y * scaleY,
      cropDataPx.width * scaleX,
      cropDataPx.height * scaleY,
      0,
      0,
      previewSize,
      previewSize
    );
    ctx.restore();
  };
  // useEffect >> ============== canvas =======================

  // 📌 هر بار completedCrop تغییر کند، canvas آپدیت شود
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      drawCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );
    }
  }, [completedCrop]);

  // Handles ----------------------------------------------------------
  // 📌 ارسال عکس کراپ شده به سرور
  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !previewCanvasRef.current) {
      alert("لطفا ابتدا یک ناحیه از عکس را انتخاب کنید.");
      return;
    }
    previewCanvasRef.current.toBlob(
      async (blob) => {
        if (!blob) {
          console.error("Failed to generate blob.");
          return;
        }
        const formData = new FormData();
        formData.append("profilePicture", blob);
        try {
          const response = await axios.patch(
            "/api/users/profile-picture",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );
          dispatch(
            authSuccess({
              ...currentUser,
              profilePicture: response.data.profilePicture,
            })
          );
          handleCloseProfilePicModal();
        } catch (error) {
          console.error("Upload failed:", error);
        }
      },
      "image/jpeg",
      1.0
    );
  };
  //////////////////////////////////////////////////////////////////////////////
  return (
    // <div
    //   style={{
    //     padding: "20px",
    //     maxWidth: "600px",
    //     margin: "auto",
    //     textAlign: "center",
    //   }}
    // >
    //   <h2>پروفایل کاربر</h2>
    //   {isLoading && <p>در حال انجام عملیات...</p>}
    //   {error && <p style={{ color: "red" }}>{error}</p>}

    //   <div
    //     style={{
    //       marginBottom: "20px",
    //       position: "relative",
    //       width: "150px",
    //       height: "150px",
    //       display: "inline-block",
    //     }}
    //   >
    //     <img
    //       src={currentUser.profilePicture || "/assets/img/wal.jfif"}
    //       alt="Profile"
    //       style={{
    //         width: "100%",
    //         height: "100%",
    //         borderRadius: "50%",
    //         objectFit: "cover",
    //         border: "3px solid #ddd",
    //       }}
    //     />
    //     <button
    //       onClick={handleProfilePicChangeClick}
    //       title="تغییر عکس پروفایل"
    //       style={{
    //         position: "absolute",
    //         bottom: "5px",
    //         right: "5px",
    //         background: "white",
    //         border: "1px solid #ccc",
    //         borderRadius: "50%",
    //         width: "35px",
    //         height: "35px",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         cursor: "pointer",
    //         fontSize: "18px",
    //       }}
    //     >
    //       ✏️
    //     </button>
    //   </div>
    //   {/* ========= Editing ====================================================== */}
    //   {isEditing ? (
    //     <form
    //       onSubmit={handleSubmitEditText}
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         gap: "15px",
    //         border: "1px solid #eee",
    //         padding: "20px",
    //         borderRadius: "8px",
    //       }}
    //     >
    //       <input
    //         type="text"
    //         name="displayName"
    //         value={formData.displayName}
    //         onChange={handleChange}
    //         placeholder="نام نمایشی"
    //       />
    //       <textarea
    //         name="bio"
    //         value={formData.bio}
    //         onChange={handleChange}
    //         placeholder="بیوگرافی"
    //       />
    //       <div style={{ display: "flex", gap: "10px" }}>

    //         <button type="submit" disabled={isLoading}>
    //           {isLoading ? "درحال ذخیره..." : "ذخیره تغییرات"}
    //         </button>

    //         <button
    //           type="button"
    //           onClick={handleEditToggle}
    //           disabled={isLoading}
    //         >
    //           انصراف
    //         </button>
    //       </div>
    //     </form>
    //   ) : (
    //     <div>
    //       <p>
    //         <strong>نام کاربری:</strong> {currentUser.username}
    //       </p>
    //       <p>
    //         <strong>ایمیل:</strong> {currentUser.email}
    //       </p>
    //       <p>
    //         <strong>نام نمایشی:</strong>{" "}
    //         {currentUser.displayName || "وارد نشده"}
    //       </p>
    //       <p>
    //         <strong>بیوگرافی:</strong> {currentUser.bio || "وارد نشده"}
    //       </p>
    //       <button onClick={handleEditToggle}>ویرایش اطلاعات</button>
    //     </div>
    //   )}

    //   {showProfilePicModal && (
    //     <div
    //       style={{
    //         position: "fixed",
    //         top: 0,
    //         left: 0,
    //         width: "100%",
    //         height: "100%",
    //         backgroundColor: "rgba(0,0,0,0.7)",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <div
    //         style={{
    //           background: "white",
    //           padding: "20px",
    //           borderRadius: "8px",
    //           width: "90%",
    //           maxWidth: "500px",
    //         }}
    //       >
    //         <h3>تغییر عکس پروفایل</h3>
    //         <input type="file" accept="image/*" onChange={onSelectFile} />
    //         {upImg && (
    //           <ReactCrop
    //             crop={crop}
    //             onChange={(c, pc) => setCrop(pc)}
    //             onComplete={(c) => setCompletedCrop(c)}
    //             aspect={1}
    //             circularCrop
    //           >
    //             <img
    //               ref={imgRef}
    //               src={upImg}
    //               alt="برای کراپ"
    //               style={{ maxHeight: "300px" }}
    //               onLoad={onImageLoad}
    //             />
    //           </ReactCrop>
    //         )}
    //         {completedCrop && (
    //           <canvas
    //             ref={previewCanvasRef}
    //             style={{
    //               border: "1px solid black",
    //               width: "150px",
    //               height: "150px",
    //               borderRadius: "50%",
    //             }}
    //           />
    //         )}
    //         <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
    //           <button
    //             onClick={handleUploadCroppedImage}
    //             disabled={!completedCrop || isLoading}
    //           >
    //             {isLoading ? "در حال ذخیره..." : "ذخیره عکس"}
    //           </button>
    //           <button onClick={handleCloseProfilePicModal} disabled={isLoading}>
    //             انصراف
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <ProfilePageContainer>
      <ProfileHeaderCard />
      {/* اینجا بعدا کامپوننت های دیگه مثل ImageGrid و ProfileActions میان */}
      {/* <div style={{ marginTop: '30px', width: '100%', maxWidth: '700px' }}>
        <h3>عکس های من</h3>
        <p>اینجا گرید عکس ها نمایش داده میشه...</p>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button>ویرایش پروفایل (دکمه اصلی)</button>
        <button style={{ marginLeft: '10px' }}>See All My Pics</button>
      </div> */}
    </ProfilePageContainer>
  );
};

export default ProfilePage;

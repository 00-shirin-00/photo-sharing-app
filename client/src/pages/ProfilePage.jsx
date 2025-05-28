// import React, { useEffect, useState, useRef } from "react";
// //redux >>
// import { useDispatch, useSelector } from "react-redux";
// //selectors >>
// import {
//   selectCurrentUser,
//   selectIsLoggedIn,
//   selectAuthLoading,
//   selectAuthError,
//   clearAuthError,
//   authRequest,
//   authSuccess,
//   authFail,
// } from "../features/auth/authSlice";

// //router >>
// import { Navigate, useNavigate } from "react-router-dom";
// // api >>
// import api from "../utils/api";

// //image-crop >>
// import ReactCrop, {
//   centerCrop,
//   convertToPercentCrop,
//   makeAspectCrop,
// } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// ///////////////////////////////////////////////////////////////////////////

// const ProfilePage = () => {
//   //HOOKS =================================================
//   // navigate >>----------------------
//   const navigate = useNavigate();

//   // useRef >>----------------------
//   const imgRef = useRef(null); // برای دسترسی به input فایل عکس پروفایل
//   const previewCanvasRef = useRef(null); // برای پیش نمایش عکس کراپ شده

//   //redux >>--------------------
//   const dispatch = useDispatch();

//   const currentUser = useSelector(selectCurrentUser);
//   const isLoggedIn = useSelector(selectIsLoggedIn);
//   const isLoading = useSelector(selectAuthLoading);
//   const error = useSelector(selectAuthError);

//   // states ======================================================
//   //To control the display of the edit form or profile information
//   const [isEditing, setIsEditing] = useState(false); // برای کنترل نمایش فرم ویرایش
//   //to store the values of the edite form
//   const [formData, setFormData] = useState({
//     displayName: "",
//     bio: "",
//     // profilePicture: '',
//   });

//   // To control the display of the profile picture modal>>
//   const [showProfilePicModal, setShowProfilePicModal] = useState(false);
//   // To store the selected profile picture file>>
//   const [upimg, setUpimg] = useState(null); //before cropping
//   const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 / 1 }); //firs crop data
//   // const [crop, setCrop] = useState();
//   const [completedCrop, setCompletedCrop] = useState(null); //after cropping

//   //conditions => ===========================================================
//   // اگر در حال لود اولیه هستیم
//   if (isLoading && !currentUser && !isLoggedIn) {
//     return <div>در حال بارگذاری...</div>;
//   }
//   // اگر هنوز در حال لود اولیه نیست و لاگین هم نکرده
//   if (!isLoading && !isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }
//   if (!currentUser) {
//     return (
//       <div>
//         در حال بارگذاری اطلاعات کاربر... (ممکن است نیاز به fetch مجدد باشد)
//       </div>
//     );
//   }

//   //handling => ===========================================================

//   //handle change>>------------------------------
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) {
//       dispatch(clearAuthError());
//     }
//   };
//   //handle edit toggle>>------------------------------
//   //رفت و برگشت بین حالت نمایش و ویرایش
//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//     if (isEditing && currentUser) {
//       // اگر از حالت ویرایش خارج میشیم، فرم رو با اطلاعات فعلی ریست کن
//       setFormData({
//         displayName: currentUser.displayName || "",
//         bio: currentUser.bio || "",
//       });
//       dispatch(clearAuthError()); // خطاهای احتمالی ویرایش رو هم پاک کن
//     }
//   };

//   //handle submit>>------------------------------------
//   // ارسال داده‌ها به سرور (با api.patch)، بروزرسانی Redux و بستن حالت ویرایش.
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(authRequest()); // برای شروع درخواست
//     try {
//       const API_URL = "/users/profile"; // آدرس API
//       // const config = {
//       //   headers: {
//       //     "Content-Type": "application/json",

//       //     //  توکن در Redux store (currentUser.token) هست و از اونجا می خونیم
//       //     Authorization: `Bearer ${currentUser.token}`, // توکن کاربر
//       //   },
//       // };
//       // فیلدهایی که می خوایم آپدیت بشن
//       const updateData = {
//         displayName: formData.displayName,
//         bio: formData.bio,
//         // profilePicture: formData.profilePicture,
//       };
//       console.log("فیلدهایی که می خوایم آپدیت بش", updateData);
//       // توکن به صورت خودکار به هدر اضافه می‌شود (نیازی به config نیست).
//       const response = await api.patch(API_URL, updateData);
//       // بعد از آپدیت موفق، اطلاعات کاربر در Redux store رو با اطلاعات جدید آپدیت کن
//       // response.data باید شامل اطلاعات آپدیت شده کاربر باشه
//       // ما همچنین باید توکن قبلی رو هم به آبجکت جدید اضافه کنیم چون API آپدیت، توکن جدید برنمیگردونه

//       console.log("اطلاعات کاربرbefor", response.data);
//       console.log("current before update", currentUser);
//       dispatch(
//         authSuccess({
//           ...currentUser,
//           ...response.data,
//           token: currentUser.token,
//         })
//       );
//       console.log("current after update", currentUser);
//       console.log("اطلاعات کاربرafter", response.data);

//       // بعد از آپدیت موفق، می‌تونید حالت ویرایش رو خاموش کنید
//       setIsEditing(false);
//       navigate("/profile");
//     } catch (error) {
//       const errorMessage =
//         error.response && error.response.data && error.response.data.message
//           ? error.response.data.message
//           : "An error occurred while updating the profile.";

//       dispatch(authFail(errorMessage)); // dispatch اکشن خطا
//     }
//   };

//   //handle img upload>>=============================================

//   // این تابع برای باز کردن مودال آپلود عکس پروفایل استفاده میشه
//   const handleProfilePicChangeClick = () => {
//     setShowProfilePicModal(true);
//   };
//   // --------------------------------
//   // این تابع برای بستن مودال آپلود عکس پروفایل استفاده میشه
//   const handleCloseProfilePicModal = () => {
//     setShowProfilePicModal(false);
//     setUpimg(null); // reset the image
//     setCompletedCrop(null); // reset the crop
//   };
// // -------------------------
//   const onSelectFile = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const reader = new FileReader();
//       reader.addEventListener("load", () => {
//         setUpimg(reader.result); // ذخیره تصویر انتخاب‌شده در state
//       });
//       reader.readAsDataURL(e.target.files[0]); // فایل رو به صورت base64 می‌خونه
//       e.target.value = null; // برای این‌که انتخاب مجدد فایل مشابه هم عمل کنه
//     }
//   };
  
//   // ---------------------------
//   const handleUploadCroppedImage = async () => {
//     if (!completedCrop || !previewCanvasRef.current) {
//       console.log("crop not completed or canvas not available");
//       return;
//     }

//     // تبدیل canvas به blob
//     previewCanvasRef.current.toBlob(
//       async (blob) => {
//         if (!blob) {
//           console.error("Failed to generate blob.");
//           return;
//         }

//         const formData = new FormData();
//         formData.append("profilePicture", blob);

//         try {
//           const response = await api.patch("/users/profile-picture", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           });

//           console.log("Upload success:", response.data);
//           dispatch(
//             authSuccess({
//               ...currentUser,
//               profilePicture: response.data.profilePicture,
//             })
//           );

//           handleCloseProfilePicModal(); // مودال رو ببند
//         } catch (error) {
//           console.error("Upload failed:", error);
//         }
//       },
//       "image/jpeg",
//       0.9
//     );
//   };
  
//   // ---------------------------------------------------------
//   // این تابع وظیفه‌ش اینه که:
//   // ✅ یک تکه از تصویر اصلی (بر اساس داده‌های کراپ)
//   // ✅ روی یک canvas دایره‌ای (پیش‌نمایش)
//   // ✅ با کیفیت مناسب و اندازه مشخص
//   // رسم کنه.
//   // ---------
//   // image: المنت <img> که تصویر لود شده توشه.
//   // canvas: المنت <canvas> که می‌خوای پیش‌نمایش رو روش بکشی.
//   // cropData: داده‌های کراپ شده (x, y, width, height) که از کتابخونه ReactCrop میاد.

//   async function canvasPreview(image, canvas, cropData) {
//     // ctx همون context دو‌بعدیه که باهاش روی canvas می‌نویسی/می‌کشی.
//     const ctx = canvas.getContext("2d");
//     // canvas => <canvas></canvas>
//     // مقدار آن برابر با نتیجه‌ی فراخوانی متد getContext روی شیء canvas است.

//     // متد getContext("2d") یک کانتکست دو‌بعدی (2D rendering context) برای رسم اشکال دوبعدی و گرافیک روی بوم (canvas) ایجاد می‌کند.
//     // اگر عنصر canvas به درستی تعریف شده باشد و مرورگر از Canvas API پشتیبانی کند، این متد یک شیء کانتکست دوبعدی برمی‌گرداند که شامل متدها و ابزارهای لازم برای رسم است.

//     // if (!ctx) {
//     //   throw new Error("No 2d context");
//     // }
//     if (!ctx) return;

//     // ابعاد ثابت برای پیش‌نمایش
//     const previewSize = 550;
//     canvas.width = previewSize;
//     canvas.height = previewSize;
//     // ----------------
//     // نسبت مقیاس بین کراپ و پیش‌نمایش
//     // «چقدر اندازه واقعی فایل بزرگ‌تر یا کوچک‌تر از اندازه نمایشی تو صفحه‌ست؟»
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     // image.naturalWidth →
//     // این عرض واقعی (پیکسلی) فایل تصویریه، یعنی همونی که مثلاً از دوربین یا فایل اصلی اومده

//     // image.width →
//     // این عرضیه که توی مرورگر روی صفحه داره نمایش داده میشه (ممکنه کوچک یا بزرگ شده باشه، چون CSS می‌تونه اندازه رو تغییر بده).

//     // وقتی کاربر بخشی از تصویر رو انتخاب (crop) می‌کنه، اون مقادیر بر اساس اندازه نمایشی هستند (چیزی که می‌بینیم).
//     // اما برای اینکه روی canvas دقیق از خود فایل اصلی برش بزنیم، باید مقیاس رو حساب کنیم تا مختصات واقعی رو به دست بیاریم.

//     // -------------
//     // ابعاد واقعی کراپ روی عکس اصلی
//     const sx = cropData.x * scaleX;
//     const sy = cropData.y * scaleY;
//     const sw = cropData.width * scaleX;
//     const sh = cropData.height * scaleY;

//     // دایره‌ای کردن پیش‌نمایش
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(previewSize / 2, previewSize / 2, previewSize / 2, 0, 2 * Math.PI);
//     ctx.closePath();
//     ctx.clip();
//     // save → وضعیت فعلی context رو ذخیره کن.
//     // beginPath + arc → یک مسیر دایره‌ای بکش.
//     // clip → کاری کن که فقط داخل این دایره چیزی نمایش داده بشه.

//     // رسم تصویر کراپ‌شده با scale مناسب در canvas ثابت
//     ctx.drawImage(
//       image,
//       sx,
//       sy,
//       sw,
//       sh, // منبع
//       0,
//       0,
//       previewSize,
//       previewSize // مقصد
//     );
//     ctx.restore();
//   }

//   // useEffect =================================================
//   // وقتی کامپوننت لود میشه یا currentUser تغییر می کنه، formData رو با اطلاعات کاربر پر کن
//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         displayName: currentUser.displayName || "",
//         bio: currentUser.bio || "",
//         // profilePicture: currentUser.profilePicture || '',
//       });
//     }
//     return () => {
//       // هنگام ورود به صفحه یا unmount شدن، خطای قبلی را پاک کن
//       dispatch(clearAuthError());
//     };
//   }, [currentUser, dispatch]);

//   // For rendering the preview of the cropped photo on canvas---------------------------------------------------
//   useEffect(() => {
//     if (
//       completedCrop?.width &&
//       completedCrop?.height &&
//       imgRef.current &&
//       previewCanvasRef.current
//     ) {
//       // یک تابع کمکی می خوایم که تصویر کراپ شده رو روی canvas بکشه
//       // این تابع رو باید جداگانه بنویسیم یا از مستندات react-image-crop بگیریم
//       canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
//     }
//   }, [completedCrop]);

//   //////////////////////////////////////////////////////////////

//   return (
//     <div
//       style={{
//         padding: "20px",
//         maxWidth: "600px",
//         margin: "auto",
//         marginTop: "10px",
//         border: "black solid 2px",
//         borderRadius: "20px",
//         lineHeight: "35px",
//       }}
//     >
//       <h2>User ProFile </h2>
//       {isLoading && <p>در حال به‌روزرسانی...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {isEditing ? (
//         // فرم ویرایش
//         <form
//           onSubmit={handleSubmit}
//           style={{ display: "flex", flexDirection: "column", gap: "15px" }}
//         >
//           <div>
//             <label htmlFor="displayName">نام نمایشی =</label>
//             <input
//               type="text"
//               id="displayName"
//               name="displayName"
//               value={formData.displayName}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px", marginTop: "5px" }}
//             />
//           </div>
//           <div>
//             <label htmlFor="bio">بیوگرافی:</label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginTop: "5px",
//                 minHeight: "80px",
//               }}
//             />
//           </div>
//           <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//             <button
//               type="submit"
//               disabled={isLoading}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#28a745",
//                 color: "white",
//               }}
//             >
//               {isLoading ? "ذخیره سازی..." : "ذخیره تغییرات"}
//             </button>
//             <button
//               type="button"
//               onClick={handleEditToggle}
//               disabled={isLoading}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#6c757d",
//                 color: "white",
//               }}
//             >
//               انصراف
//             </button>
//           </div>
//         </form>
//       ) : (
//         // نمایش اطلاعات
//         <div>
//           <p>
//             <strong>username : </strong> {currentUser.username}
//           </p>
//           <p>
//             <strong>email: </strong> {currentUser.email}
//           </p>
//           <p>
//             <strong>displayName: </strong>
//             {currentUser.displayName || "هنوز وارد نشده"}
//           </p>
//           <p>
//             <strong>bio: </strong> {currentUser.bio || "هنوز وارد نشده"}
//           </p>
//           {/* div for profile pic >>--------------- */}
//           <div
//             style={{
//               marginTop: "10px",
//               position: "relative",
//               width: "50%",
//               height: "250px",
//               // border: "2px solid #ccc",
//             }}
//           >
//             <p>
//               <strong>profile Picture :</strong>
//             </p>
//             <img
//               src={
//                 currentUser.profilePicture || "https://via.placeholder.com/100"
//               }
//               // alt="Profile"
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 border: "2px solid #ccc",
//                 position: "absolute",
//                 bottom: "0",
//                 right: "0",
//               }}
//             />
//             {/* button for change img >> */}
//             <button
//               onClick={handleProfilePicChangeClick}
//               style={{
//                 position: "absolute",
//                 bottom: "0",
//                 right: "0",
//                 padding: "5px 10px",
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 border: "1px solid #ccc",
//                 borderRadius: "50%",
//                 width: "30px",
//                 height: "30px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//               }}
//             >
//               ✏️
//             </button>
//           </div>
//           <button
//             onClick={handleEditToggle}
//             style={{
//               marginTop: "20px",
//               padding: "10px 20px",
//               backgroundColor: "#007bff",
//               color: "white",
//             }}
//           >
//             ویرایش پروفایل
//           </button>
//         </div>
//       )}

//       {/* Modal for profile picture upload >> */}
//       {showProfilePicModal && (
//         // a div for modal>>
//         <div
//           style={{
//             position: "fixed",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000, // برای اطمینان از اینکه مودال بالای همه چیز نمایش داده شود
//           }}
//         >
//           {/* محتوای مودال */}
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: "20px",
//               borderRadius: "10px",
//               width: "90%",
//               maxWidth: "500px",
//               position: "relative",
//             }}
//           >
//             <h3>changi profile image</h3>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={onSelectFile}
//               // ref={imgRef}
//               style={{
//                 marginBottom: "10px",
//                 border: "1px solid #ccc",
//                 padding: "5px",
//               }}
//             />

//             {upimg && (
//               <ReactCrop
//                 crop={crop}
//                 onChange={(c, PercentCrop) => setCrop(PercentCrop)} //استفاده از percentCrop برای سازگاری بهتر
//                 onComplete={(c) => setCompletedCrop(c)}
//                 aspect={1} //> {/* نسبت کراپ 1:1 برای دایره */}
//                 circularCrop={true} // برای کراپ دایره‌ای
//                 minWidth={100} // حداقل عرض کراپ
//                 minHeight={100} // حداقل ارتفاع کراپ
//                 ruleOfThirds // برای راهنمایی در کراپ
//               >
//                 <img
//                   ref={imgRef} // برای دسترسی به تصویر در canvas
//                   src={upimg} // تصویر انتخاب شده
//                   alt="Crop me"
//                   style={{
//                     maxHeight: "400px", // حداکثر ارتفاع تصویر
//                   }}
//                   onLoad={(e) => {
//                     const { naturalWidth, naturalHeight } = e.currentTarget;
//                     console.log(
//                       "Image natural dimensions:",
//                       naturalWidth,
//                       naturalHeight
//                     ); // لاگ اول
//                     const initialCrop = centerAspectCropLocal(
//                       naturalWidth,
//                       naturalHeight,
//                       1
//                     );
//                     console.log("Initial crop:", initialCrop); // لاگ دوم
//                     setCrop(initialCrop);
//                     setCompletedCrop(initialCrop); // برای نمایش پیش نمایش اولیه
//                   }}
//                 />
//               </ReactCrop>
//             )}

//             {/* preview of the cropped image >> */}
//             {completedCrop && (
//               <div style={{ marginTop: "20px" }}>
//                 <h4>پیش نمایش (کراپ شده):</h4>

//                 <canvas
//                   ref={previewCanvasRef}
//                   style={{
//                     border: "1px solid black",
//                     objectFit: "cover", // این برای canvas معنی زیادی نداره، برای img هست
//                     width: 350, // فعلا اینها رو کامنت کن تا ببینیم با ابعاد واقعی چطور میشه
//                     height: 350,
//                     borderRadius: "50%",
//                   }}
//                 />
//               </div>
//             )}

//             <div
//               style={{
//                 marginTop: "20px",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "10px",
//               }}
//             >
//               <button
//                 onClick={handleUploadCroppedImage}
//                 disabled={!completedCrop}
//                 // اگر کراپ تکمیل نشده باشد، دکمه غیرفعال می‌شود
//                 style={{
//                   padding: "8px 15px",
//                   backgroundColor: "#28a745",
//                   color: "white",
//                 }}
//               >
//                 save
//               </button>
//             </div>

//             <button
//               onClick={handleCloseProfilePicModal}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 padding: "5px 10px",
//                 border: "2px solid #ccc",
//                 color: "white",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//               }}
//             >
//               ❌
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;








// client/src/pages/ProfilePage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
//redux >>
import { useSelector, useDispatch } from 'react-redux';
//rout >>
import { Navigate } from 'react-router-dom';
// import api from '../api'; // اگر instance سفارشی axios ساختی
import axios from 'axios'; // یا axios معمولی

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
//sselectors >>
import {
  selectCurrentUser,
  selectIsLoggedIn,
  authSuccess,
  authRequest,
  authFail,
  selectAuthLoading,
  selectAuthError,
  clearAuthError
} from '../features/auth/authSlice';
// api >>
import api from '../api';


// / (اختیاری) کامپوننت های styled خودت رو اینجا ایمپورت کن
// import styled from 'styled-components';
// const ProfileContainer = styled.div` /* ... */ `;
// const EditButton = styled.button` /* ... */ `;
// ...

// تابع کمکی برای کراپ اولیه (از مستندات react-image-crop یا سفارشی شده)
function centerAspectCropInPixels(mediaWidth, mediaHeight, aspect = 1) {
  const initialPercentage = 0.8; // مثلا 80%
  const targetWidth = Math.min(mediaWidth, mediaHeight * aspect) * initialPercentage;
  // const targetHeight = targetWidth / aspect; // makeAspectCrop خودش height رو حساب می کنه

  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: targetWidth,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });

  // State برای مودال و کراپ عکس پروفایل
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [upImg, setUpImg] = useState(null); // URL عکس انتخاب شده برای کراپ
  const [crop, setCrop] = useState(); // اطلاعات فعلی کراپ (x, y, width, height, unit)
  const [completedCrop, setCompletedCrop] = useState(null); // اطلاعات نهایی کراپ شده (پیکسل)
  const imgRef = useRef(null); // Ref برای المنت img در ReactCrop
  const previewCanvasRef = useRef(null); // Ref برای canvas پیش نمایش

  // پر کردن فرم با اطلاعات کاربر وقتی کامپوننت لود میشه یا کاربر عوض میشه
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        bio: currentUser.bio || '',
      });
    }
    // پاک کردن خطای قبلی
    return () => {
      dispatch(clearAuthError());
    };
  }, [currentUser, dispatch]);

  // اگر کاربر لاگین نکرده و در حال لودینگ اولیه هم نیستیم، به صفحه لاگین هدایت کن
  // این کار توسط ProtectedRoute هم انجام میشه، ولی برای اطمینان بیشتر هم می تونه باشه
  if (!isLoggedIn && !isLoading && !currentUser) { // اضافه کردن شرط !currentUser برای جلوگیری از ریدایرکت در لود اولیه
    return <Navigate to="/login" replace />;
  }

  // اگر هنوز اطلاعات کاربر لود نشده (مثلا در اولین ورود به صفحه)
  if (!currentUser) {
    return <div>در حال بارگذاری اطلاعات کاربر...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        bio: currentUser.bio || '',
      });
      dispatch(clearAuthError());
    }
  };

  // هندل کردن سابمیت فرم ویرایش اطلاعات متنی
  const handleSubmitEditText = async (e) => {
    e.preventDefault();
    dispatch(authRequest());
    try {
      const API_URL = '/api/users/profile';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`, // ارسال توکن
        },
      };
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
      };
      // const response = await api.put(API_URL, updateData); // اگر از instance سفارشی api استفاده می کنی
      const response = await axios.put(API_URL, updateData, config);

      dispatch(authSuccess({ ...response.data, token: currentUser.token }));
      setIsEditing(false);
      // alert('پروفایل با موفقیت به‌روز شد!'); // یا یک پیام بهتر
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'خطایی در هنگام به‌روزرسانی پروفایل رخ داد.';
      dispatch(authFail(errorMessage));
    }
  };

  // ----- توابع مربوط به آپلود عکس پروفایل -----
  const handleProfilePicChangeClick = () => {
    setShowProfilePicModal(true);
  };

  const handleCloseProfilePicModal = () => {
    setShowProfilePicModal(false);
    setUpImg(null);
    setCrop(undefined); // ریست کردن crop
    setCompletedCrop(null);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // ریست کردن کراپ قبلی
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(String(reader.result)));
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };

  // وقتی عکس در ReactCrop لود میشه، کراپ اولیه رو تنظیم کن
  const onImageLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
    imgRef.current = e.currentTarget; // ذخیره ref به المنت img
    if (naturalWidth && naturalHeight) {
        const initialCrop = centerAspectCropInPixels(width, height, 1); // استفاده از ابعاد نمایش داده شده
        setCrop(initialCrop);
        setCompletedCrop(initialCrop); // برای نمایش پیش نمایش اولیه
    }
  }, []);


  // تابع کمکی برای کشیدن پیش نمایش روی canvas
  const canvasPreview = useCallback(async (image, canvas, cropDataPx) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(cropDataPx.width * scaleX * pixelRatio);
    canvas.height = Math.floor(cropDataPx.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = cropDataPx.x * scaleX;
    const cropY = cropDataPx.y * scaleY;

    ctx.drawImage(
      image,
      cropX, cropY,
      cropDataPx.width * scaleX, cropDataPx.height * scaleY,
      0, 0,
      cropDataPx.width * scaleX, cropDataPx.height * scaleY
    );
  }, []);


  // useEffect برای رندر کردن پیش نمایش عکس کراپ شده روی canvas
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );
    }
  }, [completedCrop, canvasPreview]);


  // تابع برای آپلود عکس کراپ شده (در گام بعدی تکمیل می شود)
  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      alert('لطفا ابتدا یک ناحیه از عکس را انتخاب کنید.');
      return;
    }
    // منطق تبدیل canvas به Blob و ارسال به سرور در اینجا خواهد بود...
    console.log('completedCrop for upload:', completedCrop);
    // مثال برای گرفتن Blob (در گام بعدی کامل می کنیم):
    // previewCanvasRef.current.toBlob(
    //   (blob) => {
    //     if (!blob) {
    //       console.error('Canvas is empty');
    //       return;
    //     }
    //     console.log('Generated Blob:', blob);
    //     // ارسال blob با FormData
    //   },
    //   'image/png', // یا image/jpeg
    //   0.8 // کیفیت (برای jpeg)
    // );
    // handleCloseProfilePicModal();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>پروفایل کاربر</h2>
      {isLoading && <p>در حال انجام عملیات...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* بخش عکس پروفایل و دکمه ویرایش آن */}
      <div style={{ marginBottom: '20px', position: 'relative', display: 'inline-block' }}>
        <img
          src={currentUser.profilePicture || 'https://via.placeholder.com/150'} // placeholder
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ddd' }}
        />
        <button
          onClick={handleProfilePicChangeClick}
          title="تغییر عکس پروفایل"
          style={{
            position: 'absolute', bottom: '5px', right: '5px', background: 'white',
            border: '1px solid #ccc', borderRadius: '50%', width: '35px', height: '35px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✏️
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmitEditText} style={{ display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
          <div>
            <label htmlFor="displayName" style={{ display: 'block', textAlign: 'right', marginBottom: '5px' }}>نام نمایشی:</label>
            <input
              type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label htmlFor="bio" style={{ display: 'block', textAlign: 'right', marginBottom: '5px' }}>بیوگرافی:</label>
            <textarea
              id="bio" name="bio" value={formData.bio} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
            <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: isLoading ? '#aaa' :'#28a745', color: 'white', borderRadius: '4px' }}>
              {isLoading ? 'ذخیره سازی...' : 'ذخیره تغییرات'}
            </button>
            <button type="button" onClick={handleEditToggle} disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px' }}>
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
          <p><strong>نام کاربری:</strong> {currentUser.username}</p>
          <p><strong>ایمیل:</strong> {currentUser.email}</p>
          <p><strong>نام نمایشی:</strong> {currentUser.displayName || 'وارد نشده'}</p>
          <p><strong>بیوگرافی:</strong> {currentUser.bio || 'وارد نشده'}</p>
          <button onClick={handleEditToggle} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', display: 'block', margin: '20px auto 0' }}>
            ویرایش اطلاعات
          </button>
        </div>
      )}

      {/* مودال برای آپلود و کراپ عکس پروفایل */}
      {showProfilePicModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
        >
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '550px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
            <h3>تغییر عکس پروفایل</h3>
            <input type="file" accept="image/*" onChange={onSelectFile} style={{ display: 'block', margin: '20px auto' }} />

            {upImg && (
              <div style={{ margin: '20px 0', border: '1px dashed #ccc', padding: '10px' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(c, pc) => setCrop(pc)} // استفاده از درصد برای crop state
                  onComplete={(c) => setCompletedCrop(c)} // completedCrop پیکسل خواهد بود
                  aspect={1}
                  circularCrop
                  minWidth={50} // حداقل اندازه کراپ
                >
                  <img
                    ref={imgRef}
                    src={upImg}
                    alt="برای کراپ"
                    style={{ maxHeight: '40vh', maxWidth: '100%' }} // محدودیت اندازه برای نمایش
                    onLoad={onImageLoad} // استفاده از onImageLoad که useCallback شده
                  />
                </ReactCrop>
              </div>
            )}

            {completedCrop && (
              <div style={{ marginTop: '20px' }}>
                <h4>پیش نمایش:</h4>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    objectFit: 'contain', // این برای canvas زیاد معنی نداره
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={handleUploadCroppedImage}
                disabled={!completedCrop || isLoading}
                style={{ padding: '10px 20px', backgroundColor: (isLoading || !completedCrop) ? '#aaa' : '#28a745', color: 'white', borderRadius: '4px' }}
              >
                {isLoading ? 'درحال ذخیره...' : 'ذخیره عکس'}
              </button>
              <button onClick={handleCloseProfilePicModal} disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px' }}>
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;









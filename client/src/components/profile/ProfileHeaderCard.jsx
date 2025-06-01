import React from "react";
//style component ----------------------
import styled from "styled-components";
//redux------------------
import { useSelector } from "react-redux";

// auth -----------------------------
import { selectCurrentUser } from "../../features/auth/authSlice";
//components ---------------------------
import ProfileAvatar from "./ProfileAvatar";
import UserInfoText from "./UserInfoText";

////////////////////////////////////////////////////////

//components
const CardContainer = styled.div`
  background-color: ${(props) =>
    props.theme.colors.neumorphismBackground || "#e0e5ec"};
  border-radius: 20px;
  padding: ${(props) => props.theme.spacings.large || "24px"};
  margin-bottom: ${(props) => props.theme.spacings.large || "24px"};
  width: 100%;
  max-width: 700px; 

  // === افکت سایه Neumorphism (حالت بیرون زده یا Flat) ===
  // این مقادیر رو باید با توجه به رنگ پس زمینه و سلیقه ات تنظیم کنی
  // می تونیم اینها رو هم در theme.js به عنوان متغیر تعریف کنیم
  box-shadow:
    // سایه تیره (پایین-راست)
    6px 6px 12px
      ${(props) => props.theme.colors.neumorphismShadowDark || "#a3b1c6"},
    // سایه روشن (بالا-چپ)
    -6px -6px 12px
      ${(props) => props.theme.colors.neumorphismShadowLight || "#ffffff"};

  display: flex; // برای چیدمان عکس و متن کنار هم
  align-items: center; // عمودی وسط چین
  gap: ${(props) =>
    props.theme.spacings.medium || "16px"}; // فاصله بین عکس و متن

  // برای حالت فرورفته (inset/pressed):
  /*
  box-shadow:
    inset 6px 6px 12px ${(props) =>
    props.theme.colors.neumorphismShadowDark || "#a3b1c6"},
    inset -6px -6px 12px ${(props) =>
    props.theme.colors.neumorphismShadowLight || "#ffffff"};
  */
`;
//////////////////////////////////////////////////////////
export default function ProfileHeaderCard() {
  //selector------------------
  const currentUser = useSelector(selectCurrentUser);

  //conditions -------------------
  if (!currentUser) return null;

  //////////////////////////////////////////////////////////
  return (
    <CardContainer>
      <ProfileAvatar imageUrl={currentUser.profilePicture} altText={currentUser.displayName || currentUser.username} />
      <div>اینجا عکس پروفایل (ProfileAvatar) میاد</div>
      <UserInfoText
        displayName={currentUser.displayName || currentUser.username}
        username={currentUser.username}
        bio={currentUser.bio}
      />
      <div>
        <h3>{currentUser.displayName || currentUser.username}</h3>
        <p>@{currentUser.username}</p>
        <p>{currentUser.bio || "بیوگرافی هنوز وارد نشده."}</p>
      </div>
    </CardContainer>
  );
}

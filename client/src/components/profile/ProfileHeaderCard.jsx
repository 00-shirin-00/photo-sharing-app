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
  /* min-height: calc(80vh - 60px); */
  max-width: 700px;

  box-shadow:
    // سایه تیره (پایین-راست)
    6px 6px 12px
      ${(props) => props.theme.colors.neumorphismShadowDark || "#a3b1c6"},
    // سایه روشن (بالا-چپ)
    -6px -6px 12px
      ${(props) => props.theme.colors.neumorphismShadowLight || "#ffffff"};

  display: flex;
  align-items: center;
  justify-content:space-evenly;

  gap: ${(props) =>
    props.theme.spacings.medium || "16px"}; // فاصله بین عکس و متن
  /* -------------------------------------------------------- */
  // برای حالت فرورفته (inset/pressed):
  /*
  box-shadow:
    inset 6px 6px 12px ${(props) =>
    props.theme.colors.neumorphismShadowDark || "#a3b1c6"},
    inset -6px -6px 12px ${(props) =>
    props.theme.colors.neumorphismShadowLight || "#ffffff"};
  */
  /* -------------------------------------------------------- */
`;
//////////////////////////////////////////////////////////
export default function ProfileHeaderCard() {
  //selector------------------
  const currentUser = useSelector(selectCurrentUser);

  //conditions -------------------
  if (!currentUser) return null;

  //handle -----------------------
  const handleEditAvatarClick = () => {
    // اینجا بعدا منطق باز کردن مودال آپلود عکس پروفایل رو اضافه می کنیم
    console.log("Edit avatar clicked!");
  };
  //////////////////////////////////////////////////////////
  return (
    <CardContainer>
      <ProfileAvatar
        imageUrl={currentUser.profilePicture}
        altText={currentUser.displayName || currentUser.username}
        onEditClick={handleEditAvatarClick}
      />
      <UserInfoText
        displayName={currentUser.displayName || currentUser.username}
        // username={currentUser.username}
        // bio={currentUser.bio}
      />
    </CardContainer>
  );
}

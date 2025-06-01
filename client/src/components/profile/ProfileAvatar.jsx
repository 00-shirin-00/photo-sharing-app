import React from "react";
// style ------------------
import styled from "styled-components";
////////////////////////////////////////////
//COMPONENTS
const AvatarWrapper = styled.div`
  position: relative;
  width: 120px; // اندازه آواتار
  height: 120px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.theme.colors.neumorphismBackground || "#e0e5ec"};
  padding: 8px; // یک فاصله کوچک برای ایجاد افکت بهتر دور عکس

  //  حالت "فرو رفته" برای قاب دور عکس
  box-shadow: inset 4px 4px 8px
      ${(props) => props.theme.colors.neumorphismShadowDark || "#a3b1c6"},
    inset -4px -4px 8px
      ${(props) => props.theme.colors.neumorphismShadowLight || "#ffffff"};
`;
// --------------

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

// -------------

const EditIconWrapper = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: ${(props) => props.theme.colors.primary || "#007bff"};
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 

  &:hover {
    opacity: 0.9;
  }
`;
//////////////////////////////////////////////


// تابعی که با کلیک روی آیکون ویرایش اجرا میشه
export default function ProfileAvatar({ imageUrl, altText, onEditClick }) {
    const defaultAvatar = '/assets/img/wal.jfif'

  /////////////////////////////////////////////////
  return (
    <AvatarWrapper>
      <AvatarImage src={imageUrl || defaultAvatar} alt={altText || "Avatar"} />
      {onEditClick && ( // فقط اگر تابع onEditClick پاس داده شده بود، آیکون رو نشون بده
        <EditIconWrapper onClick={onEditClick} aria-label="ویرایش عکس پروفایل">
          {/* <FaEdit /> */} E {/* فعلا یک حرف E به جای آیکون */}
        </EditIconWrapper>
      )}
    </AvatarWrapper>
  );
}

import React from "react";
import styled from "styled-components";

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacings.small || "8px"};
  color: ${(props) => props.theme.colors.text || "#333"}; 
`;

const DisplayName = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.large || "1.5rem"};
  font-weight: bold;
  margin: 0;
`;

const Username = styled.p`
  font-size: ${(props) => props.theme.fontSizes.medium || "1rem"};
  color: ${(props) => props.theme.colors.textLight || "#777"};
  margin: 0;
`;

const Bio = styled.p`
  font-size: ${(props) => props.theme.fontSizes.medium || "1rem"};
  margin-top: ${(props) => props.theme.spacings.small || "8px"};
  white-space: pre-wrap; // برای حفظ خطوط جدید در بیوگرافی
`;

const UserInfoText = ({ displayName, username, bio }) => {
  return (
    <TextContainer>
      <DisplayName>{displayName}</DisplayName>
      {/* <Username>{username}</Username>
      {bio && <Bio>{bio}</Bio>} */}
    </TextContainer>
  );
};

export default UserInfoText;

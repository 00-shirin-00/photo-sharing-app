import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

//styles >>
import styled from "styled-components";
// ===============================================
// styled-components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacings || "1rem"};
  background-color: ${({ theme }) => theme.colors.primary || "#007bff"};
  color: white;
`;

const NavLinks = styled.div`
  a,
  button {
    color: white;
    text-decoration: none;
    margin: ${({ theme }) => theme.spacings.medium || "1rem"};
    bgcolor: none;
    border: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.medium || "1rem"};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.large || "1.5rem"};
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

export default function Header() {
  //state userInfo>>
  const [userInfo, setUserInfo] = useState(null);

  //navigate
  const navigate = useNavigate();

  //get user info from local storage
  useEffect(() => {
    //خواندن اطلاعات کاربر از localStorage >>
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  //set user info to local storage
  useEffect(() => {
    const updateUserInfo = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      setUserInfo(storedUserInfo) ? JSON.parse(storedUserInfo) : null;
    };

    updateUserInfo();

    window.addEventListener("userInfoChanged", updateUserInfo);

    return () => {
      window.removeEventListener("userInfoChanged", updateUserInfo);
    };
  }, []);

  //handle logout
  const handleLogout = () => {
    //حذف اطلاعات کاربر از localStorage
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  /////////////////////////////////////////////////////////////////
  return (
    <Nav>
      <Logo to="/">PhotoApp</Logo>
      <NavLinks>
        {userInfo ? (
          <>
            {/* <Link to='/profile'>{userInfo.displayName || userInfo.username}</Link> */}
            <span>wellCome ,{userInfo.displayName}...</span>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <Link to="/login">login</Link>
            <Link to="/register">register</Link>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}

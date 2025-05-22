import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

//redux>>----------------------
import { useSelector, useDispatch } from "react-redux";
//actions
import { logout } from "../../features/auth/authSlice";
//selectors
import { selectCurrentUser, selectIsLoggedIn } from "../../features/auth/authSlice";

//styles >>---------------------
import styled from "styled-components";
import ProfilePage from "../../pages/ProfilePage";
// ===============================================
// styled-components--------
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
  //redux>>
  const dispatch = useDispatch();
  //navigate
  const navigate = useNavigate();

  // خواندن اطلاعات کاربر و وضعیت لاگین از Redux store-------------
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  //handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  /////////////////////////////////////////////////////////////////
  return (
    <Nav>
      <Logo to="/">PhotoApp</Logo>
      <NavLinks>
        {isLoggedIn ? (
          <>
            <Link to='/profile'>profile</Link>
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

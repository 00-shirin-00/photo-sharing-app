import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

//  redux>>--------
//hooks
import { useSelector, useDispatch } from "react-redux";

//action creator
import {
  authRequest,
  authSuccess,
  authFail,
  clearAuthError,
} from "./authSlice";

//selectors
import {
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
} from "./authSlice";

//=============================================
//proxy vite.config.js
const API_URL = "/api/auth";


const RegisterPage = () => {
  // statse>>-----------------------------------
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    bio: "",
    profilePicture: "",
  }); //for data input

  //redux>>-----------------------------------
  const dispatch = useDispatch();
  //router>>-----------------------------
  const navigate = useNavigate();

  //selectors>>----------------------
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  //distructure form data>>-------------------------------------
  const { username, email, password, displayName, bio, profilePicture } =
    formData;

  // اگر کاربر از قبل لاگین کرده باشه، به صفحه اصلی هدایتش می کنیم---------------------

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  // (این برای حالتیه که کاربر لاگین کرده و به اشتباه به صفحه ثبت نام میاد)

  // پاک کردن خطای قبلی وقتی کاربر شروع به تایپ می کنه (اختیاری)---------------------
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  //handle input change>>------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearAuthError());
    }
  };

  //handle form submit>>--------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authRequest()); //for loading and start state

    if (password.length < 6) {
      dispatch(authFail("password must be at least 6 characters"));
      return;
    } //for password length

    try {

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        username,
        email,
        password,
        displayName,
        bio,
        profilePicture,
      };
      const response = await axios.post(`${API_URL}/register`, body, config);

      // console.log(response.data);

      // response.data باید شامل userInfo و توکن باشه که در authSlice ذخیره میشه
      dispatch(authSuccess(response.data)); //for success state

      navigate("/profile"); // بعد از ثبت نام موفق، کاربر رو به صفحه profile هدایت می کنیم
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(authFail(errorMessage)); //for error state
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////
  return (
    // <RegisterContainer>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>Register form</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* success و نمیاریم چون بالا navigate کردیم به پروفایلش */}

      {/* <Form>---------------------------------------- */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "300px",
        }}
      >
        <div>
          <label htmlFor="username">UsEr:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="email">EMail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="password">pass :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="displayName">naMe :</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="bio">bio :</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={bio}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="profilePicture">profile picture :</label>
          <input
            type="text"
            id="profilePicture"
            name="profilePicture"
            value={profilePicture}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isLoading ? "loading..." : "Register"}
        </button>
      </form>
      <p>
        do you have an account?
        <Link
          to="/login"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          login form
        </Link>
      </p>
    </div>
    // </RegisterContainer>
  );
};

export default RegisterPage;

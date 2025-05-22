import React, { useState, useEffect } from "react";
import axios from "axios";
//router
import { Link, useNavigate, useLocation } from "react-router-dom";

//redux>>-----------------------------------
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

// =========================================================================
//proxy vite.config.js
const API_URL = "/api/auth"; // api endpoint

export default function LoginPage() {
  // state>>-----------------------------------
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //redux>>-----------------------------------
  const dispatch = useDispatch();
  //router>>-----------------------------
  const navigate = useNavigate();
  const location = useLocation(); // گرفتن آبجکت location

  //location >>----------------------
  // اگر کاربر از قبل لاگین کرده باشه، به صفحه اصلی هدایتش می کنیم
  // و اگر لاگین نکرده باشه، به صفحه ای که می خواسته بره هدایتش می کنیم
  const form = location.state?.form?.pathname || "/";

  //selectors>>----------------------
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  //distructure form data>>-------------------------------------
  const { username, password } = formData;

  //isLoggedIn>>-------------------------------------
  // اگر کاربر از قبل لاگین کرده باشه، به صفحه اصلی هدایتش می کنیم
  useEffect(() => {
    if (isLoggedIn) {
      navigate(form, { replace: true }); // به مسیر قبلی یا صفحه اصلی هدایت شود
    }
  }, [isLoggedIn, navigate,form]);

  // پاک کردن خطای قبلی وقتی کاربر شروع به تایپ می کنه (اختیاری)---------------------
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  //handle input change>>------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearAuthError());
    }
  };
  //handle form submit>>--------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authRequest()); //for loading and start state

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        username,
        password,
      };

      // Send login request to the server
      const response = await axios.post(`${API_URL}/login`, body, config);

      dispatch(authSuccess(response.data)); // Update Redux state with user info

      console.log("body =>", body);
      console.log("response =>", response);
      console.log("login server response:", response.data);
    } catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message
          : "username or password is incorrect";
      dispatch(authFail(errorMessage)); // Update Redux state with error message
      console.error("Login error:", errorMessage);
    }
  };

  // //////////////////////////////////////////////////////
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>ورود به حساب کاربری</h2>
      {isLoading && <p>در حال بررسی اطلاعات...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
          <label htmlFor="username"> username:</label>
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
          <label htmlFor="password">pass:</label>
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
          {isLoading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        you don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          REGISTER
        </Link>
      </p>
    </div>
  );
}

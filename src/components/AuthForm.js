// src/components/AuthForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import Swal from "sweetalert2";
import "../styles/AuthForm.css";

const AuthForm = ({ closeAuth, setUser, user }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  // If the user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const togglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        Swal.fire({
          title: "Success!",
          text: "Login successful!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard");
        if (closeAuth) closeAuth();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Login failed",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords don't match!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      await axiosInstance.post("/auth/signup", payload);
      Swal.fire({
        title: "Success!",
        text: "Account created successfully! You can now log in.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setIsLogin(true);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Registration failed",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button
          className="close-btn"
          onClick={() => {
            if (closeAuth) {
              closeAuth();
            } else {
              navigate("/");
            }
          }}
        >
          ×
        </button>
        <div className="auth-header">
          <h1>{isLogin ? "Welcome Back" : "Hello Friend!"}</h1>
          <p>{isLogin ? "Sign in to continue" : "Start your journey"}</p>
        </div>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-group">
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePassword}
            >
              {formData.showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit" className="auth-btn">
            {isLogin ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
          {isLogin && (
            <a href="#forgot" className="forgot-password">
              Forgot password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

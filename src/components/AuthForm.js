import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/AuthForm.css";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function AuthForm({ closeAuth }) {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Mode & role
  const [mode, setMode] = useState("login");    // "login" or "signup"
  const [role, setRole] = useState("user");     // "user" or "vendor"

  // Form state
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  // Password visibility
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dest = role === "vendor" ? "/vendor/dashboard" : "/dashboard";
      navigate(dest, { replace: true });
      closeAuth();
    }
  }, [user, role, navigate, closeAuth]);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // signup password match check
    if (mode === "signup" && form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Passwords must match", "error");
    }

    try {
      let url, payload;
      if (mode === "login") {
        url = role === "vendor"
          ? `${API}/vendor/auth/login`
          : `${API}/auth/login`;
        payload = { email: form.email, password: form.password };
      } else {
        url = role === "vendor"
          ? `${API}/vendor/auth/signup`
          : `${API}/auth/signup`;
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
        };
        if (role === "vendor") payload.businessName = form.businessName;
      }

      const res = await axios.post(url, payload);
      const { token, user: u } = res.data;

      // Use context login
      login(u, token);

      Swal.fire("Success", `${mode} successful`, "success");
      // Redirect happens in useEffect
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="close-btn" onClick={closeAuth}>×</button>
        <h2>{mode === "login" ? "Sign In" : "Sign Up"}</h2>

        <div className="form-group">
          <label>
            I am a:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
            </select>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {role === "vendor" && (
                <div className="form-group">
                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPass((s) => !s)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {mode === "signup" && (
            <div className="form-group password-group">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          )}

          {mode === "signup" && (
            <div className="form-group terms-group">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              <label htmlFor="agree">
                I have read and agree to the{" "}
                <Link to="/terms" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Link>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={mode === "signup" && !form.agree}
          >
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          {mode === "login" && (
            <p className="forgot-line">
              <a href="/forgot-password">Forgot password?</a>
            </p>
          )}
          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              className="mode-toggle-btn"
              onClick={() =>
                setMode((m) => (m === "login" ? "signup" : "login"))
              }
            >
              {mode === "login" ? " Sign Up" : " Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar"; 
import axiosInstance from "../utils/axiosConfig";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Retrieve user from localStorage on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showLogin || showSignup);
  }, [showLogin, showSignup]);

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", loginData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);

        Swal.fire({ title: "Success!", text: "Login successful!", icon: "success", timer: 2000, showConfirmButton: false });
        setShowLogin(false);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: "Login failed. Please check your credentials.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    Swal.fire({ title: "Logged Out!", text: "You have been logged out successfully.", icon: "info", timer: 2000, showConfirmButton: false })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
      });
  };

  return (
    <>
      {user ? (
        <Sidebar user={user} handleLogout={handleLogout} />
      ) : (
        <nav className="navbar">
          <Link to="/" className="explore-nepal">Guide Nepal</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/vendors">Vendors</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
          {!user && <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>}
        </nav>
      )}

      {/* ✅ LOGIN MODAL (Fix: Now Opens Correctly) */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input type={passwordVisible ? "text" : "password"} required value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <button type="submit" className="submit-btn">Sign In</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
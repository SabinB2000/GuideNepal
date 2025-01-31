import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "User" }); // Change this to fetch user data if needed
    }
  }, []);

  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showLogin, showSignup]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", loginData);

      localStorage.setItem("token", response.data.token);
      setUser({ name: "User" });

      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        confirmButtonText: "OK",
      });

      setShowLogin(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login failed. Please check your credentials.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/signup", signupData);

      Swal.fire({
        title: "Success!",
        text: "Signup successful! Please log in.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setShowSignup(false);
      setShowLogin(true);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Signup failed. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    Swal.fire({
      title: "Logged Out!",
      text: "You have been logged out.",
      icon: "info",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/";
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="explore-nepal">EXPLORE NEPAL</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/vendors">Vendors</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
      </ul>

      {user ? (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <button type="submit" className="submit-btn">Sign In</button>
            </form>
            <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-btn">Join Us</button>
            </form>
            <button className="close-btn" onClick={() => setShowSignup(false)}>×</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

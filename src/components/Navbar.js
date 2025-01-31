import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "../styles/Navbar.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "Traveler" }); // Placeholder user
    }
  }, []);

  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showLogin, showSignup]);

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", loginData);

      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        confirmButtonText: "OK",
      });

      localStorage.setItem("token", response.data.token);
      setUser({ name: "Traveler" }); // Set user state
      setShowLogin(false);

      // ✅ Redirect to Dashboard
      setTimeout(() => {
        navigate("/dashboard");
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

  // ✅ Handle Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Logged Out!",
      text: "You have been logged out successfully.",
      icon: "info",
      confirmButtonText: "OK",
    }).then(() => {
      localStorage.removeItem("token"); // ✅ Clear user session
      setUser(null); // ✅ Reset user state
      navigate("/"); // ✅ Redirect to homepage
      window.location.reload(); // ✅ Refresh to clear session state
    });
  };

  return (
    <>
      {user ? (
        <Sidebar user={user} handleLogout={handleLogout} />
      ) : (
        <nav className="navbar">
          <Link to="/" className="explore-nepal">EXPLORE NEPAL</Link>

          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/vendors">Vendors</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>

          {!user && (
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
                  <div className="modal-links">
                    <p>
                      Don't have an account?{" "}
                      <span className="green-link" onClick={() => { setShowLogin(false); setShowSignup(true); }}>
                        Sign Up
                      </span>
                    </p>
                  </div>
                </form>
                <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;

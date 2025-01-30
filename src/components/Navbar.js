import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showLogin, showSignup]);

  return (
    <nav className="navbar">
      {/* LEFT: EXPLORE NEPAL */}
      <Link to="/" className="explore-nepal">
        EXPLORE NEPAL
      </Link>

      {/* CENTER: LINKS */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/vendors">Vendors</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
      </ul>

      {/* RIGHT: LOGIN BUTTON */}
      <button className="login-btn" onClick={() => setShowLogin(true)}>
        Login
      </button>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign In</h2>
            <form>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input type={passwordVisible ? "text" : "password"} required />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <button type="submit" className="submit-btn">Sign In</button>
              <div className="modal-links">
                <a href="#forgot">Forgot Password?</a>
                <p>
                  Don't have an account?{' '}
                  <span
                    className="green-link"
                    onClick={() => {
                      setShowLogin(false);
                      setShowSignup(true);
                    }}
                  >
                    Sign Up
                  </span>
                </p>
              </div>
            </form>
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign Up</h2>
            <form>
              <div className="input-group">
                <label>First Name</label>
                <input type="text" required />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input type={passwordVisible ? "text" : "password"} required />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="terms-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">Accept Terms & Conditions</label>
              </div>
              <button type="submit" className="submit-btn">Join Us</button>
              <div className="modal-links">
                <p>
                  Already have an account?{' '}
                  <span
                    className="green-link"
                    onClick={() => {
                      setShowSignup(false);
                      setShowLogin(true);
                    }}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
            <button className="close-btn" onClick={() => setShowSignup(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

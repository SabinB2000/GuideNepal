import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import AuthForm from "./AuthForm";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logged Out!",
      text: "You have been logged out successfully.",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
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
            <Link to="/admin-login" className="nav-link">Admin</Link>

          </ul>
          <button className="login-btn" onClick={() => setShowAuth(true)}>LOGIN / SIGNUP</button>
        </nav>
      )}

      {showAuth && <AuthForm closeAuth={() => setShowAuth(false)} setUser={setUser} />}
    </>
  );
};

export default Navbar;

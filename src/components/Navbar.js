import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import AuthForm from "./AuthForm";
import "../styles/Navbar.css";

export default function Navbar({ openAuth }) {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
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
      timer: 1500,
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
        <nav className="navbar navbar--minimal">
          <Link
            to="/"
            className="navbar__logo"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Guide Nepal
          </Link>
          <button
            className="navbar__login-btn"
            onClick={openAuth}
          >
            LOGIN / SIGNUP
          </button>
        </nav>
      )}

      {showAuth && (
        <AuthForm
          closeAuth={() => {
            setShowAuth(false);
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
          }}
          setUser={setUser}
        />
      )}
    </>
  );
}

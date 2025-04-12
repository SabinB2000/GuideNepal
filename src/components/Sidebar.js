// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button
        className="menu-toggle"
        onClick={() => setIsOpen((o) => !o)}
      >
        ☰
      </button>
      <ul>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">
            🏠 {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li className={isActive("/itinerary") ? "active" : ""}>
          <Link to="/itinerary">
            📅 {isOpen && <span>Itinerary</span>}
          </Link>
        </li>
        <li className={isActive("/vendors") ? "active" : ""}>
          <Link to="/vendors">
            🛍️ {isOpen && <span>Vendors</span>}
          </Link>
        </li>
        <li className={isActive("/explore") ? "active" : ""}>
          <Link to="/explore">
            🧭 {isOpen && <span>Explore</span>}
          </Link>
        </li>
        <li className={isActive("/map") ? "active" : ""}>
          <Link to="/map">
            🗺️ {isOpen && <span>Map</span>}
          </Link>
        </li>
        <li className={isActive("/translate") ? "active" : ""}>
          <Link to="/translate">
            🌎 {isOpen && <span>Translate</span>}
          </Link>
        </li>
        <li className={isActive("/reviews") ? "active" : ""}>
          <Link to="/reviews">
            ⭐ {isOpen && <span>Reviews</span>}
          </Link>
        </li>
        <li className={isActive("/profile") ? "active" : ""}>
          <Link to="/profile">
            👤 {isOpen && <span>Profile</span>}
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={logout}>
            🚪 {isOpen && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}

// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Updated active check: it considers the route active if the pathname matches
  // or starts with the route path followed by a slash (for nested routes).
  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard" className="menu-item">
            🏠 <span className="menu-text">{isOpen && "Dashboard"}</span>
          </Link>
        </li>
        <li className={isActive("/itineraries") ? "active" : ""}>
          <Link to="/itineraries" className="menu-item">
            📅 <span className="menu-text">{isOpen && "My Itineraries"}</span>
          </Link>
        </li>
        <li className={isActive("/vendors") ? "active" : ""}>
          <Link to="/vendors" className="menu-item">
            🛍️ <span className="menu-text">{isOpen && "Vendors & Events"}</span>
          </Link>
        </li>
        <li className={isActive("/explore") ? "active" : ""}>
          <Link to="/explore" className="menu-item">
            🧭 <span className="menu-text">{isOpen && "Explore Nepal"}</span>
          </Link>
        </li>
        <li className={isActive("/map") ? "active" : ""}>
          <Link to="/map" className="menu-item">
            🗺️ <span className="menu-text">{isOpen && "Map & Navigation"}</span>
          </Link>
        </li>
        <li className={isActive("/translate") ? "active" : ""}>
          <Link to="/translate" className="menu-item">
            🌎 <span className="menu-text">{isOpen && "Translation Tool"}</span>
          </Link>
        </li>
        <li className={isActive("/reviews") ? "active" : ""}>
          <Link to="/reviews" className="menu-item">
            ⭐ <span className="menu-text">{isOpen && "Reviews"}</span>
          </Link>
        </li>
        <li className={isActive("/profile") ? "active" : ""}>
          <Link to="/profile" className="menu-item">
            👤 <span className="menu-text">{isOpen && "Profile"}</span>
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 <span className="menu-text">{isOpen && "Logout"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

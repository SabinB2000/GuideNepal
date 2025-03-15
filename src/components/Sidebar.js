import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <h2 className={isCollapsed ? "hidden" : ""}>Guide Nepal</h2>
      <ul>
        <li>
          <Link to="/dashboard" className="menu-item">
            <span className="icon">🏠</span>
            {!isCollapsed && <span className="text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/itineraries" className="menu-item">
            <span className="icon">📅</span>
            {!isCollapsed && <span className="text">My Itineraries</span>}
          </Link>
        </li>
        <li>
          <Link to="/vendors" className="menu-item">
            <span className="icon">🛍️</span>
            {!isCollapsed && <span className="text">Vendors & Events</span>}
          </Link>
        </li>
        <li>
          <Link to="/map" className="menu-item">
            <span className="icon">🗺️</span>
            {!isCollapsed && <span className="text">Map & Navigation</span>}
          </Link>
        </li>
        <li>
          <Link to="/translate" className="menu-item">
            <span className="icon">🌎</span>
            {!isCollapsed && <span className="text">Translation Tool</span>}
          </Link>
        </li>
        <li>
          <Link to="/reviews" className="menu-item">
            <span className="icon">⭐</span>
            {!isCollapsed && <span className="text">Reviews</span>}
          </Link>
        </li>
        <li>
          <Link to="/profile" className="menu-item">
            <span className="icon">👤</span>
            {!isCollapsed && <span className="text">Profile</span>}
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span>
            {!isCollapsed && <span className="text">Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
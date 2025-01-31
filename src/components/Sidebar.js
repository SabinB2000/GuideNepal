import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  // Fix Logout Function Here
  const logout = () => {
    localStorage.removeItem("token"); // ✅ Remove user session
    navigate("/"); // ✅ Redirect to login
    window.location.reload(); // ✅ Force page refresh to remove sidebar
  };

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <h2 className={isCollapsed ? "hidden" : ""}>Guide Nepal</h2>
      <ul>
        <li><Link to="/dashboard" title="Dashboard">📊 {!isCollapsed && "Dashboard"}</Link></li>
        <li><Link to="/itineraries" title="My Itineraries">📅 {!isCollapsed && "My Itineraries"}</Link></li>
        <li><Link to="/vendors" title="Vendors & Events">🛍️ {!isCollapsed && "Vendors & Events"}</Link></li>
        <li><Link to="/map" title="Map & Navigation">🗺️ {!isCollapsed && "Map & Navigation"}</Link></li>
        <li><Link to="/translate" title="Translation Tool">🌎 {!isCollapsed && "Translation Tool"}</Link></li>
        <li><Link to="/reviews" title="Reviews">⭐ {!isCollapsed && "Reviews"}</Link></li>
        <li><Link to="/profile" title="Profile">👤 {!isCollapsed && "Profile"}</Link></li>
        <li>
          <button className="logout-btn" onClick={logout}>🚪 {!isCollapsed && "Logout"}</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/VendorSidebar.css";

export default function VendorSidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Collapse automatically on small screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = e => setCollapsed(e.matches);
    handler(mq);
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/", { replace: true });
  };

  return (
    <div className={`vs-container ${collapsed ? "collapsed" : ""}`}>
      {/* toggle button */}
      <button className="vs-toggle" onClick={() => setCollapsed(c => !c)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <div className="vs-links">
        <NavLink
          to="/vendor/dashboard"
          end                             // ← exact match
          className={({ isActive }) =>
            isActive ? "vs-link active" : "vs-link"
          }
        >
          <span className="vs-icon">🏠</span>
          <span className="vs-text">Dashboard</span>
        </NavLink>

        <NavLink
          to="/vendor/places"
          end                             // ← exact match
          className={({ isActive }) =>
            isActive ? "vs-link active" : "vs-link"
          }
        >
          <span className="vs-icon">📍</span>
          <span className="vs-text">Manage Places</span>
        </NavLink>

        <NavLink
          to="/vendor/places/new"
          className={({ isActive }) =>
            isActive ? "vs-link active" : "vs-link"
          }
        >
          <span className="vs-icon">➕</span>
          <span className="vs-text">Add New</span>
        </NavLink>

        <NavLink
          to="/vendor/events"
          end
          className={({ isActive }) =>
            isActive ? "vs-link active" : "vs-link"
          }
        >
          <span className="vs-icon">🎉</span>
          <span className="vs-text">Manage Events</span>
        </NavLink>

        <NavLink
          to="/vendor/settings"
          end
          className={({ isActive }) =>
            isActive ? "vs-link active" : "vs-link"
          }
        >
          <span className="vs-icon">⚙️</span>
          <span className="vs-text">Settings</span>
        </NavLink>
      </div>

      <button className="vs-logout" onClick={handleLogout}>
        <span className="vs-icon">🚪</span>
        <span className="vs-text">Log Out</span>
      </button>
    </div>
  );
}

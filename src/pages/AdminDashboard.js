// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlaces: 0,
    totalItineraries: 0,
    totalEvents: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Admin token from localStorage:", token);
        if (!token) {
          setError("No token found. Please log in as admin.");
          return;
        }
        const res = await axiosInstance.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError('⚠️ Unable to fetch stats. Are you logged in as admin?');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar onLogout={handleLogout} />
      <div className="admin-dashboard-content">
        <div className="admin-card">
          <h2 className="dashboard-heading">Welcome, Admin</h2>
          <p className="dashboard-subtext">This is your control panel.</p>

          {error && <p className="error-text">{error}</p>}

          <div className="dashboard-stats">
            <div className="dashboard-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Places</h3>
              <p>{stats.totalPlaces}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Itineraries</h3>
              <p>{stats.totalItineraries}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Events</h3>
              <p>{stats.totalEvents}</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <button className="dashboard-btn" onClick={() => navigate('/admin-manage-users')}>
              ⚙️ Manage Users
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/admin-manage-places')}>
              🗺️ Manage Places
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/admin-manage-itineraries')}>
              📅 Manage Itineraries
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/admin-manage-events')}>
              🎫 Manage Events
            </button>
            <button className="dashboard-btn logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

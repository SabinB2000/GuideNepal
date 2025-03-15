import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import background from "../assets/background.jpg";
import { useTheme } from "../context/ThemeContext";
import RecentSearches from '../components/RecentSearches';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅ Fix: Ensure loading state is handled
        const token = localStorage.getItem("token");
    
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        
        const [userRes, placesRes, searchesRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/places`),
          axios.get(`${API_URL}/searches`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
    
        setUser(userRes.data);
        //setPlaces(placesRes.data);
        //setRecentSearches(searchesRes.data);
    
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Loading Error',
          text: 'Failed to load dashboard data',
          confirmButtonText: 'Try Again'
        });
      } finally {
        setLoading(false); // ✅ Fix: Ensure loading state is updated
      }
    };
    

    fetchData();
  }, []);

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      <div className="dashboard-bg" style={{ backgroundImage: `url(${background})` }}></div>

      <button onClick={toggleTheme} className="theme-toggle">
        {darkMode ? "🌞" : "🌙"}
      </button>

      <div className="welcome-section">
        <img 
          src={user?.profilePic || background} 
          alt="Profile" 
          className="profile-pic" 
          onError={(e) => e.target.src = background}
        />
        <h2>Welcome, {user?.name || 'Traveler'}!</h2>
      </div>

      <div className="quick-access">
        <Link to="/map" className="quick-btn">🗺️ Explore Map</Link>
        <Link to="/saved" className="quick-btn">📍 Saved Places</Link>
        <Link to="/itineraries" className="quick-btn">📝 Itineraries</Link>
        <Link to="/events" className="quick-btn">🎉 Nearby Events</Link>
      </div>
    </div>
  );
};

export default Dashboard;

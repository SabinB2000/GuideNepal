import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import background from "../assets/background.jpg";
import { useTheme } from "../context/ThemeContext";
import RecentSearches from '../components/RecentSearches';
import SavedPlaces from '../components/SavedPlaces'; // ✅ Import Saved Places


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [places, setPlaces] = useState([]); // ✅ State for Saved Places
  const [recentSearches, setRecentSearches] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

        const [userRes, placesRes, searchesRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/saved-places`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/searches`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setSavedPlaces(placesRes.data);
        setRecentSearches(searchesRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Loading Error',
          text: 'Failed to load dashboard data',
          confirmButtonText: 'Try Again'
        });
      } finally {
        setLoading(false);
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
          onError={(e) => (e.target.src = background)}
        />
        <h2>Welcome, {user?.name || "Traveler"}!</h2>
      </div>

      <div className="quick-access">
        <Link to="/map" className="quick-btn">🗺️ Explore Map</Link>
        <Link to="/saved" className="quick-btn">📍 Saved Places</Link>
        <Link to="/itineraries" className="quick-btn">📝 Itineraries</Link>
        <Link to="/events" className="quick-btn">🎉 Nearby Events</Link>
      </div>

      {/* ✅ Saved Places Section */}
      <div className="saved-places">
        <h3>📍 Your Saved Places</h3>
        {savedPlaces.length > 0 ? (
          <ul>
            {savedPlaces.map((place) => (
              <li key={place.id}>
                <Link to={`/places/${place.id}`}>{place.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved places yet.</p>
        )}
      </div>

      {/* ✅ Recent Searches Section */}
      <div className="recent-searches">
        <RecentSearches searches={recentSearches} />
      </div>
    </div>
  );
};

export default Dashboard;

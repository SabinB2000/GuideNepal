// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

        const [userRes, placesRes, searchesRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/saved-places`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/searches`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setSavedPlaces(placesRes.data);
        setRecentSearches(searchesRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch dashboard data",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="welcome-section">
          <img
            src={user?.profilePic || "/assets/default-profile.png"}
            alt="Profile"
            className="profile-pic"
          />
          <h2>Welcome, {user?.name || "Traveler"}!</h2>
        </div>

        <div className="quick-access">
          <Link to="/map" className="quick-btn">🗺️ Explore Map</Link>
          <Link to="/saved" className="quick-btn">📍 Saved Places</Link>
          <Link to="/itineraries" className="quick-btn">📝 Itineraries</Link>
          <Link to="/events" className="quick-btn">🎉 Nearby Events</Link>
        </div>

        <div className="saved-places">
          <h3>Your Saved Places</h3>
          {savedPlaces.length > 0 ? (
            <ul>
              {savedPlaces.map((place) => (
                <li key={place.id}>{place.name}</li>
              ))}
            </ul>
          ) : (
            <p>No saved places yet.</p>
          )}
        </div>

        <div className="recent-searches">
          <h3>Recent Searches</h3>
          {recentSearches.length > 0 ? (
            <ul>
              {recentSearches.map((search) => (
                <li key={search._id}>{search.query}</li>
              ))}
            </ul>
          ) : (
            <p>No recent searches.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

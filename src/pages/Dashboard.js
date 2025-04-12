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
  const [events, setEvents] = useState([]);        // new: upcoming events
  const [recommendations, setRecommendations] = useState([]); // new: recommended places

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

        // 1) Profile
        const userRes = await axios.get(`${API_URL}/auth/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 2) Saved places
        const placesRes = await axios.get(`${API_URL}/saved-places`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 3) Recent searches
        const searchesRes = await axios.get(`${API_URL}/searches`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 4) Upcoming events (optional)
        const eventsRes = await axios.get(`${API_URL}/events?limit=3`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 5) Recommended places (optional)
        const recRes = await axios.get(`${API_URL}/places/recommended?limit=3`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        setSavedPlaces(placesRes.data);
        setRecentSearches(searchesRes.data);
        setEvents(eventsRes.data); 
        setRecommendations(recRes.data);

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
        
        {/* Welcome Section */}
        <div className="welcome-section">
          <img
            src={
              user?.profilePicture
                ? `http://localhost:5000${user.profilePicture}`
                : "/assets/default-profile.png"
            }
            alt="Profile"
            className="profile-pic"
          />
          <h2>Welcome, {user?.name || "Traveler"}!</h2>
        </div>

        {/* Quick Access */}
        <div className="quick-access">
          <Link to="/map" className="quick-btn">🗺️ Explore Map</Link>
          <Link to="/saved" className="quick-btn">📍 Saved Places</Link>
          <Link to="/itinerary" className="quick-btn">📝 Itineraries</Link>
          <Link to="/events" className="quick-btn">🎉 Nearby Events</Link>
        </div>

        {/* Saved Places */}
        <div className="saved-places">
          <h3>📍 Your Saved Places</h3>
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

        {/* Recent Searches */}
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

        {/* Upcoming Events (Optional) */}
        {events.length > 0 && (
          <div className="events-section">
            <h3>Upcoming Events</h3>
            <ul>
              {events.map((evt) => (
                <li key={evt._id}>
                  <strong>{evt.title}</strong> - {evt.date}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Places (Optional) */}
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h3>Recommended Places</h3>
            <ul>
              {recommendations.map((rec) => (
                <li key={rec._id}>
                  {rec.title} — {rec.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

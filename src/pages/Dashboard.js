import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css"; 

const Dashboard = () => {
  const [userName, setUserName] = useState("Traveler");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Determine greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Retrieve stored user name from localStorage (if available)
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserName(storedUser);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <h1>{greeting}, {userName}! 🌿</h1>
        <p>Your personalized travel experience starts here.</p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/itineraries" className="action-btn">📅 Plan a New Trip</Link>
          <Link to="/vendors" className="action-btn">🛍️ Explore Vendors & Events</Link>
          <Link to="/map" className="action-btn">🗺️ Open Map & Navigation</Link>
        </div>
      </div>

      {/* Travel Overview */}
      <div className="dashboard-section travel-overview">
        <h2>My Travel Overview</h2>
        <div className="overview-box">
          <p>🌍 <strong>3</strong> upcoming trips planned</p>
          <p>⭐ <strong>7</strong> places reviewed</p>
          <p>📍 Favorite destination: <strong>Phewa Lake</strong></p>
        </div>
      </div>

      {/* Local Events */}
      <div className="dashboard-section local-events">
        <h2>Upcoming Local Events & Offers</h2>
        <ul>
          <li>🎉 Kathmandu Cultural Fest - Feb 15</li>
          <li>🥾 Pokhara Trekking Marathon - March 5</li>
          <li>🏯 Heritage Walk in Bhaktapur - March 20</li>
        </ul>
      </div>

      {/* Travel Stats */}
      <div className="dashboard-section travel-stats">
        <h2>Travel Stats & Insights</h2>
        <div className="stats-box">
          <p>📅 <strong>12</strong> total trips planned</p>
          <p>📌 <strong>5</strong> new locations explored</p>
          <p>💬 <strong>10</strong> reviews written</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

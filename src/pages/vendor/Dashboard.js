import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import VendorSidebar from "../../components/VendorSidebar";
import "../../styles/VendorPage.css";
import "../../styles/VendorDashboard.css";
import { Link } from "react-router-dom";

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    pendingPlaces: 0,
    approvedPlaces: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    recentPlaces: [],
  });

  useEffect(() => {
    axiosInstance
      .get("/vendor/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="vendor-page">
      <VendorSidebar onLogout={() => { /* clear user state */ }} />
      <div className="vendor-content">
        <h1>Welcome, Vendor!</h1>

        <div className="vd-stats">
          <div className="vd-card pending">
            <h2>{stats.pendingPlaces}</h2>
            <p>Places Pending</p>
          </div>
          <div className="vd-card approved">
            <h2>{stats.approvedPlaces}</h2>
            <p>Places Approved</p>
          </div>
          <div className="vd-card pending">
            <h2>{stats.pendingEvents}</h2>
            <p>Events Pending</p>
          </div>
          <div className="vd-card approved">
            <h2>{stats.approvedEvents}</h2>
            <p>Events Approved</p>
          </div>
        </div>

        <section className="vd-recent">
          <h2>Recent Places</h2>
          {stats.recentPlaces.length === 0 ? (
            <p>No places yet.</p>
          ) : (
            <ul>
              {stats.recentPlaces.map(place => (
                <li key={place._id}>
                  <Link to={`/vendor/places/${place._id}`}>
                    {place.title}
                  </Link>
                  <span className={`status ${place.status}`}>
                    {place.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    preferences: "",
  });

  useEffect(() => {
    // Fetch user data from backend (Mocked for now)
    setUserData({ name: "Traveler", email: "user@example.com", preferences: "Adventure" });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Profile Updated!");
    // API call to update user data
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Name:</label>
        <input type="text" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />

        <label>Email:</label>
        <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />

        <label>Preferences:</label>
        <input type="text" value={userData.preferences} onChange={(e) => setUserData({ ...userData, preferences: e.target.value })} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;

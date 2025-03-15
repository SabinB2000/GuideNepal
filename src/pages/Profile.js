import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          setLoading(false);
          return;
        }

        console.log("Stored Token:", token);

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile/me`, // ✅ Fixed API Route
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Profile API Response:", response.data);

        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in again.");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/profile/update`, // ✅ FIXED API ROUTE
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Profile Updated Successfully:", response.data);

      setUser(response.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-page">
      {loading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="profile-card">
          <h2>👤 User Profile</h2>
          <img src="/assets/profile.png" alt="Profile" />

          {editing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="edit-input"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="edit-input"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="edit-input"
              />
              <button onClick={handleSave} className="save-btn">💾 Save</button>
            </>
          ) : (
            <>
              <p><span className="profile-info">First Name:</span> {user.firstName}</p>
              <p><span className="profile-info">Last Name:</span> {user.lastName}</p>
              <p><span className="profile-info">Email:</span> {user.email}</p>
              <p><span className="profile-info">Joined On:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              <button onClick={handleEditToggle} className="edit-btn">✏️ Edit Profile</button>
            </>
          )}
        </div>
      ) : (
        <p className="error-message">⚠ No profile found. Please check your account.</p>
      )}
    </div>
  );
};

export default Profile;

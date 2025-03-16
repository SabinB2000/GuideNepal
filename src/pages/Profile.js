import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: null,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
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

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile/me`, // ✅ Ensure correct API path
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => setEditing(!editing);
  const handlePasswordToggle = () => setChangingPassword(!changingPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/update`, // ✅ Ensure correct API
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handlePasswordSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/change-password`, // ✅ Ensure correct API
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully!");
      setChangingPassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  return (
    <div className="profile-page">
      {loading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="profile-card">
          <h2>👤 User Profile</h2>
          <img
            src={user.profilePicture || "/assets/profile.png"}
            alt="Profile"
          />

          {editing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
              />
              <button onClick={handleSave}>💾 Save</button>
            </>
          ) : (
            <>
              <p>First Name: {user.firstName}</p>
              <button onClick={handleEditToggle}>✏️ Edit Profile</button>
              <button onClick={handlePasswordToggle}>🔒 Change Password</button>
            </>
          )}

          {changingPassword && (
            <>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handlePasswordChange}
              />
              <button onClick={handlePasswordSave}>🔑 Save Password</button>
            </>
          )}
        </div>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default Profile;

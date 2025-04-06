// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing states
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form data for profile update
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });

  // For immediate preview of the profile image
  const [previewImage, setPreviewImage] = useState("/assets/default-profile.png");

  // Password data
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          profilePicture: response.data.profilePicture || "",
        });
        if (response.data.profilePicture) {
          // If backend returns a relative path, adjust it (change the URL if needed)
          setPreviewImage(`http://localhost:5000${response.data.profilePicture}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Toggle functions
  const handleEditToggle = () => {
    setEditing(!editing);
    setChangingPassword(false);
  };

  const handlePasswordToggle = () => {
    setChangingPassword(!changingPassword);
    setEditing(false);
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection and immediate preview
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        setPreviewImage(ev.target.result);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Save profile updates
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);

      // If a new image was selected (i.e. not a string already)
      if (typeof formData.profilePicture !== "string") {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.put(
        `${API_URL}/profile/update`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      // Update the form with new data
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        profilePicture: response.data.profilePicture || "",
      });
      if (response.data.profilePicture) {
        setPreviewImage(`http://localhost:5000${response.data.profilePicture}`);
      }
      setEditing(false);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Save password change
  const handlePasswordSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      await axios.put(
        `${API_URL}/profile/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: "Success!",
        text: "Password updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setChangingPassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to change password.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  if (loading)
    return <div className="loading-message">Loading profile...</div>;
  if (!user)
    return <div className="loading-message">No profile found.</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>User Profile</h2>

        {/* Profile Image Preview */}
        <div className="profile-image-section">
          <img src={previewImage} alt="Profile" className="profile-img" />
        </div>

        {editing ? (
          <>
            <form className="edit-form">
              <label>Update Profile Image:</label>
              <input type="file" onChange={handleFileChange} />

              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </form>

            <div className="button-group">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="back-btn" onClick={() => setEditing(false)}>
                Back
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <div className="button-group">
              <button className="edit-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
              <button className="edit-btn" onClick={handlePasswordToggle}>
                {changingPassword ? "Close Password" : "Change Password"}
              </button>
            </div>
          </>
        )}

        {changingPassword && (
          <div className="password-section">
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter old password"
              onChange={handlePasswordChange}
            />
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={handlePasswordChange}
            />
            <div className="button-group">
              <button className="save-btn" onClick={handlePasswordSave}>
                Save Password
              </button>
              <button
                className="back-btn"
                onClick={() => setChangingPassword(false)}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

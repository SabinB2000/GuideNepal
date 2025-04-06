import React, { useState } from "react";
import axios from "axios";
import "../styles/PlaceDetails.css";

const PlaceDetails = ({ place }) => {
  const [saved, setSaved] = useState(false);

  const handleSavePlace = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to save places");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/saved-places/save`,
        { placeId: place._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      alert(response.data.message);
    } catch (error) {
      console.error("Error saving place:", error);
      alert("Failed to save place");
    }
  };

  return (
    <div className="place-details">
      <h2>{place.name}</h2>
      <p>{place.description}</p>
      <button onClick={handleSavePlace} disabled={saved} className="save-btn">
        {saved ? "Saved ✅" : "Save Place 📍"}
      </button>
    </div>
  );
};

export default PlaceDetails;

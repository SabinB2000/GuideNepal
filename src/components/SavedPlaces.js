import React from "react";
import "../styles/SavedPlaces.css"; // ✅ Import the CSS

const SavedPlaces = ({ places }) => {
  return (
    <div className="saved-places">
      <h3>📍 Saved Places</h3>
      {places.length > 0 ? (
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              <span>{place.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No places saved yet.</p>
      )}
    </div>
  );
};

export default SavedPlaces;

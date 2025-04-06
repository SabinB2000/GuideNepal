// src/pages/UserItineraryView.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import '../styles/UserItineraryView.css'; // Create/update styling as needed

const UserItineraryView = ({ itineraryId }) => {
  const [itinerary, setItinerary] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    places: []
  });
  const [places, setPlaces] = useState([]);

  const fetchItinerary = async () => {
    try {
      const res = await axios.get(`/itineraries/${itineraryId}`); // Assuming a public endpoint for itineraries
      setItinerary(res.data);
      setFormData({
        title: res.data.title,
        description: res.data.description,
        places: res.data.places.map(p => p._id)
      });
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  // Fetch all places for customization options
  const fetchPlaces = async () => {
    try {
      const res = await axios.get('/places'); // Public endpoint for places (adjust as needed)
      setPlaces(res.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    fetchItinerary();
    fetchPlaces();
  }, [itineraryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlacesChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, places: value }));
  };

  const handleSave = async () => {
    try {
      // For user customization, assuming there is a user endpoint for updating itineraries.
      // This may be a different API route from the admin one.
      const res = await axios.put(`/itineraries/${itineraryId}`, formData);
      setItinerary(res.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }
  };

  if (!itinerary) return <p>Loading itinerary...</p>;

  return (
    <div className="user-itinerary container">
      {!editMode ? (
        <div>
          <h2>{itinerary.title}</h2>
          <p>{itinerary.description}</p>
          <h4>Places:</h4>
          <ul>
            {itinerary.places.map(place => (
              <li key={place._id}>{place.name}</li>
            ))}
          </ul>
          <button onClick={() => setEditMode(true)} className="btn btn-primary">
            Customize Itinerary
          </button>
        </div>
      ) : (
        <div className="itinerary-edit-form">
          <h2>Edit Itinerary</h2>
          <div className="form-group">
            <label>Title:</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Select Places:</label>
            <select multiple value={formData.places} onChange={handlePlacesChange}>
              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSave} className="btn btn-success">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserItineraryView;

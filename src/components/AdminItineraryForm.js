// src/components/AdminItineraryForm.js
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import '../styles/AdminItineraryForm.css';

const AdminItineraryForm = ({ itinerary, onSuccess, onCancel }) => {
  // Pre-fill fields if editing
  const [title, setTitle] = useState(itinerary ? itinerary.title : '');
  const [description, setDescription] = useState(itinerary ? itinerary.description : '');
  const [detailedSchedule, setDetailedSchedule] = useState(
    itinerary ? itinerary.detailedSchedule : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      detailedSchedule
    };

    try {
      if (itinerary) {
        // Update existing itinerary
        await axiosInstance.put(`/admin/itineraries/${itinerary._id}`, payload);
      } else {
        // Create new itinerary
        await axiosInstance.post('/admin/itineraries', payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving itinerary:", err);
      setError("Error saving itinerary.");
    }
  };

  return (
    <div className="itinerary-form-modal">
      <div className="form-container">
        <h2>{itinerary ? 'Edit Itinerary' : 'Add New Itinerary'}</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Short Description / Overview:</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Detailed Schedule:</label>
            <textarea 
              value={detailedSchedule}
              onChange={(e) => setDetailedSchedule(e.target.value)}
              rows={8}
              placeholder="E.g. Early Morning: Visit Swayambhunath Stupa, Breakfast at Thamel, etc."
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {itinerary ? 'Update Itinerary' : 'Create Itinerary'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminItineraryForm;

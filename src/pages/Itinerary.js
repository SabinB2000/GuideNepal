// src/pages/Itinerary.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import Swal from "sweetalert2";
import "../styles/Itinerary.css";

const Itinerary = () => {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(3);
  const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/itineraries");
      setItineraries(response.data);
    } catch (error) {
      console.error("Fetch Itineraries Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load itineraries.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const createItinerary = async () => {
    if (!title.trim() || places.length === 0) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter a title and at least one place.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/itineraries/create", { title, days, places });
      Swal.fire({
        title: "Success!",
        text: "Itinerary created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchItineraries();
      setTitle("");
      setPlaces([]);
    } catch (error) {
      console.error("Create Itinerary Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create itinerary. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItinerary = async (id) => {
    try {
      await axiosInstance.delete(`/itineraries/${id}`);
      Swal.fire({
        title: "Deleted!",
        text: "Itinerary deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchItineraries();
    } catch (error) {
      console.error("Delete Itinerary Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete itinerary. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const addPlace = () => {
    setPlaces([...places, { name: "", location: { lat: 0, lng: 0 }, description: "" }]);
  };

  return (
    <div className="itinerary-page">
      <div className="itinerary-content">
        <h2>Create a New Itinerary</h2>
        <div className="input-section">
          <input
            type="text"
            placeholder="Itinerary Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="select-days">
            {[1, 2, 3, 5, 7].map((d) => (
              <option key={d} value={d}>
                {d} Days
              </option>
            ))}
          </select>
        </div>

        <button className="add-place-btn" onClick={addPlace} disabled={loading}>
          + Add Place
        </button>

        {places.map((place, index) => (
          <div key={index} className="place-row">
            <input
              type="text"
              placeholder="Place Name"
              value={place.name}
              onChange={(e) => {
                const updated = [...places];
                updated[index].name = e.target.value;
                setPlaces(updated);
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Description"
              value={place.description}
              onChange={(e) => {
                const updated = [...places];
                updated[index].description = e.target.value;
                setPlaces(updated);
              }}
              className="input-field"
            />
          </div>
        ))}

        <button className="create-btn" onClick={createItinerary} disabled={loading}>
          {loading ? "Creating..." : "Create Itinerary"}
        </button>
      </div>

      <div className="itinerary-list">
        <h3>Saved Itineraries</h3>
        {itineraries.map((it) => (
          <div key={it._id} className="itinerary-card">
            <h4>{it.title}</h4>
            <p>{it.days} Days</p>
            <button className="delete-btn" onClick={() => removeItinerary(it._id)}>
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itinerary;

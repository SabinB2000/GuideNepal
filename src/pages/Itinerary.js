import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import Swal from "sweetalert2";
import { 
  FiPlus, 
  FiTrash2, 
  FiCalendar, 
  FiMapPin, 
  FiEdit2, 
  FiSave,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMap
} from "react-icons/fi";
import "../styles/Itinerary.css";

const Itinerary = () => {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(3);
  const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [expandedItinerary, setExpandedItinerary] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);

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
      showAlert("Error!", "Failed to load itineraries.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim() || places.length === 0) {
      showAlert("Warning!", "Please enter a title and at least one place.", "warning");
      return;
    }
    
    try {
      setLoading(true);
      const payload = { title, days, places };
      
      if (editMode && currentItinerary) {
        await axiosInstance.put(`/itineraries/${currentItinerary._id}`, payload);
        showAlert("Updated!", "Itinerary updated successfully!", "success");
      } else {
        await axiosInstance.post("/itineraries/create", payload);
        showAlert("Success!", "Itinerary created successfully!", "success");
      }
      
      fetchItineraries();
      resetForm();
      setEditMode(false);
      setCurrentItinerary(null);
    } catch (error) {
      console.error("Itinerary Error:", error);
      showAlert("Error!", `Failed to ${editMode ? 'update' : 'create'} itinerary. Please try again.`, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeItinerary = async (id) => {
    try {
      await axiosInstance.delete(`/itineraries/${id}`);
      showAlert("Deleted!", "Itinerary deleted successfully!", "success");
      fetchItineraries();
    } catch (error) {
      console.error("Delete Itinerary Error:", error);
      showAlert("Error!", "Failed to delete itinerary. Please try again.", "error");
    }
  };

  const editItinerary = (itinerary) => {
    setTitle(itinerary.title);
    setDays(itinerary.days);
    setPlaces(itinerary.places);
    setCurrentItinerary(itinerary);
    setEditMode(true);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const resetForm = () => {
    setTitle("");
    setDays(3);
    setPlaces([]);
  };

  const addPlace = () => {
    setPlaces([...places, { name: "", location: { lat: 0, lng: 0 }, description: "" }]);
  };

  const removePlace = (index) => {
    const updatedPlaces = [...places];
    updatedPlaces.splice(index, 1);
    setPlaces(updatedPlaces);
  };

  const toggleItinerary = (id) => {
    setExpandedItinerary(expandedItinerary === id ? null : id);
  };

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h1>Travel Itinerary Planner</h1>
        <p>Plan your perfect trip with our easy-to-use itinerary builder</p>
      </div>

      <div className="itinerary-tabs">
        <button
          className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("create");
            if (editMode) {
              setEditMode(false);
              resetForm();
            }
          }}
        >
          <FiPlus /> {editMode ? "Cancel Edit" : "Create New"}
        </button>
        <button
          className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          <FiCalendar /> My Itineraries
        </button>
      </div>

      {activeTab === "create" ? (
        <div className="create-itinerary">
          <div className="form-card">
            <h2>
              {editMode ? (
                <>
                  <FiEdit2 /> Edit Itinerary
                </>
              ) : (
                <>
                  <FiPlus /> Build Your Itinerary
                </>
              )}
            </h2>
            
            <div className="form-group">
              <label>Itinerary Title</label>
              <input
                type="text"
                placeholder="e.g., Summer Europe Trip 2023"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Duration (Days)</label>
              <div className="duration-selector">
                {[1, 2, 3, 5, 7, 10, 14].map((d) => (
                  <button
                    key={d}
                    className={`day-btn ${days === d ? "active" : ""}`}
                    onClick={() => setDays(d)}
                  >
                    {d}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  className="day-input"
                />
              </div>
            </div>

            <div className="places-section">
              <h3>
                <FiMapPin /> Places to Visit
                <button className="add-place-btn" onClick={addPlace}>
                  <FiPlus /> Add Place
                </button>
              </h3>

              {places.length === 0 ? (
                <div className="empty-places">
                  <p>No places added yet. Start building your itinerary!</p>
                </div>
              ) : (
                <div className="places-list">
                  {places.map((place, index) => (
                    <div key={index} className="place-card">
                      <div className="place-header">
                        <span className="place-number">{index + 1}</span>
                        <button
                          className="remove-place-btn"
                          onClick={() => removePlace(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Place name (e.g., Eiffel Tower)"
                        value={place.name}
                        onChange={(e) => {
                          const updated = [...places];
                          updated[index].name = e.target.value;
                          setPlaces(updated);
                        }}
                        className="form-input"
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={place.description}
                        onChange={(e) => {
                          const updated = [...places];
                          updated[index].description = e.target.value;
                          setPlaces(updated);
                        }}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="submit-btn"
              onClick={handleCreateOrUpdate}
              disabled={loading || places.length === 0}
            >
              {loading ? (
                <>
                  <div className="spinner"></div> {editMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave /> {editMode ? "Update Itinerary" : "Save Itinerary"}
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="itineraries-list">
          {itineraries.length === 0 ? (
            <div className="empty-itineraries">
              <img src="/assets/no-itineraries.svg" alt="No itineraries" />
              <h3>No Itineraries Yet</h3>
              <p>Start by creating your first travel itinerary!</p>
              <button
                className="create-new-btn"
                onClick={() => setActiveTab("create")}
              >
                <FiPlus /> Create New Itinerary
              </button>
            </div>
          ) : (
            <>
              <div className="stats-bar">
                <div className="stat-card">
                  <h4>Total Itineraries</h4>
                  <p>{itineraries.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Average Duration</h4>
                  <p>
                    {(
                      itineraries.reduce((sum, it) => sum + it.days, 0) /
                      itineraries.length
                    ).toFixed(1)}{" "}
                    days
                  </p>
                </div>
                <div className="stat-card">
                  <h4>Total Places</h4>
                  <p>
                    {itineraries.reduce((sum, it) => sum + it.places.length, 0)}
                  </p>
                </div>
              </div>

              <div className="itinerary-cards">
                {itineraries.map((it) => (
                  <div
                    key={it._id}
                    className={`itinerary-card ${
                      expandedItinerary === it._id ? "expanded" : ""
                    }`}
                  >
                    <div
                      className="card-header"
                      onClick={() => toggleItinerary(it._id)}
                    >
                      <div className="card-title">
                        <h3>{it.title}</h3>
                        <div className="card-meta">
                          <span className="duration-badge">
                            <FiClock /> {it.days} Day{it.days > 1 ? "s" : ""}
                          </span>
                          <span className="places-badge">
                            <FiMapPin /> {it.places.length} Places
                          </span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            editItinerary(it);
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            Swal.fire({
                              title: 'Delete Itinerary?',
                              text: "You won't be able to revert this!",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Yes, delete it!'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                removeItinerary(it._id);
                              }
                            });
                          }}
                        >
                          <FiTrash2 />
                        </button>
                        <span className="expand-icon">
                          {expandedItinerary === it._id ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      </div>
                    </div>

                    {expandedItinerary === it._id && (
                      <div className="card-details">
                        <div className="detail-row">
                          <h4>Places to Visit:</h4>
                          <button 
                            className="map-view-btn"
                            onClick={() => {
                              // Implement map view functionality
                              showAlert("Coming Soon!", "Map view will be available in the next update.", "info");
                            }}
                          >
                            <FiMap /> View on Map
                          </button>
                        </div>
                        <div className="places-grid">
                          {it.places.map((place, index) => (
                            <div key={index} className="place-item">
                              <span className="place-number">{index + 1}</span>
                              <div className="place-info">
                                <h5>{place.name}</h5>
                                {place.description && (
                                  <p>{place.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Itinerary;
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminManagePlaces.css';
import axiosInstance from '../utils/axiosConfig'; // uses interceptors to include token

const UNSPLASH_ACCESS_KEY = "LIoaOeFaFZsQHpmN4LTFfCswzlOLjCMc27sC0ACS0gY";

const AdminManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Kathmandu',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [editingPlace, setEditingPlace] = useState(null);

  const fetchPlaces = async () => {
    try {
      // axiosInstance attaches token automatically
      const res = await axiosInstance.get('/admin/places');
      setPlaces(res.data);
    } catch (error) {
      console.error('Failed to fetch places:', error);
    }
  };

  const fetchUnsplashImage = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query},Kathmandu&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const data = await res.json();
      const url = data.results[0]?.urls?.regular || '';
      setImagePreview(url);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Failed to fetch Unsplash image:', error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchUnsplashImage(formData.title), 600);
    return () => clearTimeout(delay);
  }, [formData.title]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddPlace = async () => {
    try {
      await axiosInstance.post('/admin/places', formData);
      alert("✅ Place added successfully");
      setFormData({ title: '', description: '', location: 'Kathmandu', image: '' });
      setImagePreview('');
      fetchPlaces();
    } catch (error) {
      console.error('Error adding place:', error);
      alert("❌ Failed to add place");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/places/${id}`);
      alert("🗑️ Place deleted");
      fetchPlaces();
    } catch (error) {
      console.error('Delete failed:', error);
      alert("❌ Failed to delete place");
    }
  };

  const handleEditClick = (place) => {
    setEditingPlace(place);
    setFormData({
      title: place.title,
      description: place.description,
      location: place.location,
      image: place.image,
    });
    setImagePreview(place.image);
  };

  const handleUpdatePlace = async () => {
    try {
      await axiosInstance.put(`/admin/places/${editingPlace._id}`, formData);
      alert("✏️ Place updated successfully");
      setEditingPlace(null);
      setFormData({ title: '', description: '', location: 'Kathmandu', image: '' });
      setImagePreview('');
      fetchPlaces();
    } catch (error) {
      console.error('Update failed:', error);
      alert("❌ Failed to update place");
    }
  };

  return (
    <div className="admin-manage-places-container">
      <AdminSidebar />
      <div className="admin-manage-places-content">
        <h2>📍 Manage Places</h2>

        <div className="add-place-form">
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter Place Title"
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={formData.description}
            placeholder="Write short description..."
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            readOnly
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}

          {editingPlace ? (
            <button className="add-btn" onClick={handleUpdatePlace}>
              ✏️ Update Place
            </button>
          ) : (
            <button className="add-btn" onClick={handleAddPlace}>
              ➕ Add Place
            </button>
          )}
        </div>

        <div className="places-list">
          {places.length === 0 ? (
            <p className="no-data">No places found.</p>
          ) : (
            places.map((place) => (
              <div key={place._id} className="place-card">
                <img src={place.image} alt={place.title} />
                <div className="place-details">
                  <h3>{place.title}</h3>
                  <p>{place.description}</p>
                  <p>
                    <strong>📍 Location:</strong> {place.location}
                  </p>
                </div>
                <div className="btn-group">
                  <button className="edit-btn" onClick={() => handleEditClick(place)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(place._id)}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagePlaces;

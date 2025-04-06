// src/pages/AdminManageItineraries.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import AdminSidebar from '../components/AdminSidebar';
import AdminItineraryForm from '../components/AdminItineraryForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../styles/AdminManageItineraries.css';

const AdminManageItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const res = await axiosInstance.get('/admin/itineraries');
      setItineraries(res.data);
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      setError("Unable to fetch itineraries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/itineraries/${id}`);
        setItineraries(itineraries.filter(item => item._id !== id));
        Swal.fire("Deleted!", "Itinerary has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting itinerary:", err);
        Swal.fire("Error!", "Unable to delete itinerary.", "error");
      }
    }
  };

  const handleEdit = (itinerary) => {
    setEditingItinerary(itinerary);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItinerary(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchItineraries();
    Swal.fire("Success!", "Itinerary saved successfully.", "success");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-card">
          <h2>Manage Itineraries</h2>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" onClick={handleAddNew}>
            Add New Itinerary
          </button>
          {loading ? (
            <p>Loading itineraries...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Overview</th>
                  <th>Detailed Schedule</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itineraries.map(item => (
                  <tr key={item._id}>
                    <td data-label="Title">{item.title}</td>
                    <td data-label="Overview">{item.description}</td>
                    <td data-label="Detailed Schedule">
                      {item.detailedSchedule
                        ? item.detailedSchedule.substring(0, 60) + '...'
                        : 'N/A'}
                    </td>
                    <td data-label="Actions">
                      <button className="btn btn-secondary" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/admin-dashboard')}>
            Back to Dashboard
          </button>
        </div>
        {showForm && (
          <AdminItineraryForm
            itinerary={editingItinerary}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminManageItineraries;

// src/pages/AdminManageItineraries.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import AdminSidebar from '../components/AdminSidebar';
import AdminItineraryForm from '../components/AdminItineraryForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
      setLoading(true);
      const res = await axiosInstance.get('/admin/itineraries');
      setItineraries(res.data);
      setError('');
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      setError("Unable to fetch itineraries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
      backdrop: `rgba(0,0,0,0.4)`,
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    });
    
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/itineraries/${id}`);
        setItineraries(itineraries.filter(item => item._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Itinerary has been deleted.",
          icon: "success",
          confirmButtonColor: "#6c0000"
        });
      } catch (err) {
        console.error("Error deleting itinerary:", err);
        Swal.fire({
          title: "Error!",
          text: "Unable to delete itinerary. Please try again.",
          icon: "error",
          confirmButtonColor: "#6c0000"
        });
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
    Swal.fire({
      title: "Success!",
      text: "Itinerary saved successfully.",
      icon: "success",
      confirmButtonColor: "#6c0000",
      timer: 2000,
      timerProgressBar: true
    });
  };

  const renderLoadingSkeleton = () => {
    return Array(5).fill(0).map((_, index) => (
      <tr key={`skeleton-${index}`} className="skeleton-row">
        <td><div className="skeleton" style={{ height: '20px' }}></div></td>
        <td><div className="skeleton" style={{ height: '20px' }}></div></td>
        <td><div className="skeleton" style={{ height: '20px' }}></div></td>
        <td><div className="skeleton" style={{ height: '20px', width: '120px' }}></div></td>
      </tr>
    ));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-card">
          <div className="header-actions">
            <h2>Manage Itineraries</h2>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
              </svg>
              Add New Itinerary
            </button>
          </div>
          
          {error && (
            <div className="error-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              {error}
            </div>
          )}
          
          <div className="table-responsive">
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
                {loading ? (
                  renderLoadingSkeleton()
                ) : itineraries.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                          <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        <p>No itineraries found</p>
                        <button className="btn btn-primary" onClick={handleAddNew}>Create Your First Itinerary</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  itineraries.map(item => (
                    <tr key={item._id}>
                      <td data-label="Title">{item.title}</td>
                      <td data-label="Overview" className="truncate-text">{item.description}</td>
                      <td data-label="Detailed Schedule" className="truncate-text">
                        {item.detailedSchedule
                          ? item.detailedSchedule.substring(0, 60) + '...'
                          : 'N/A'}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button className="btn btn-secondary" onClick={() => handleEdit(item)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDelete(item._id, item.title)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/admin-dashboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Back to Dashboard
          </button>
        </div>
        {showForm && (
          <div className="admin-card">
            <AdminItineraryForm
              itinerary={editingItinerary}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageItineraries;
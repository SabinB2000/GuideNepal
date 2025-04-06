// src/pages/AdminManageEvents.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import AdminSidebar from '../components/AdminSidebar';
import AdminEventForm from '../components/AdminEventForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/AdminManageEvents.css';

const AdminManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get('/admin/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Unable to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This event will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/events/${id}`);
        setEvents(events.filter(event => event._id !== id));
        Swal.fire("Deleted!", "The event has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting event:", err);
        Swal.fire("Error!", "Unable to delete event.", "error");
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchEvents();
    Swal.fire("Success!", "Event saved successfully.", "success");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-card">
          <h2>Manage Events</h2>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" onClick={handleAddNew}>
            Add New Event
          </button>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td data-label="Title">{event.title}</td>
                    <td data-label="Description">{event.description}</td>
                    <td data-label="Date">{new Date(event.date).toLocaleDateString()}</td>
                    <td data-label="Location">{event.location}</td>
                    <td data-label="Actions">
                      <button className="btn btn-secondary" onClick={() => handleEdit(event)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(event._id)}>
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
          <AdminEventForm
            event={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminManageEvents;

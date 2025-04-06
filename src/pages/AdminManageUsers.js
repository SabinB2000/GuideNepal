import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminManageUsers.css';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError("Unable to fetch users.");
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await axiosInstance.delete(`/admin/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        setError("Delete failed.");
      }
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-card">
          <h2>Manage Users</h2>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search users..."
              className="search-bar"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/admin-dashboard')}
            >
              Dashboard
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button 
                      className="btn btn-edit"
                      onClick={() => navigate(`/edit-user/${user._id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;
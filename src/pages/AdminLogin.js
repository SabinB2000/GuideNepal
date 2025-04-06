import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data; // we also get user: { id, email, role }

      // Set token and role into localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);  // Store role directly from the response

      // Check if the user role is admin
      if (user.role !== 'admin') {
        setError('Access denied: Not an admin');
        return;
      }

      navigate('/admin-dashboard');  // Redirect to the admin dashboard
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="admin-login-input"
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="admin-login-input"
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="admin-login-button">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;

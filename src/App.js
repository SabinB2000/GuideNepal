import { Routes, Route } from "react-router-dom"; // ✅ Import only Routes & Route
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Vendors from "./pages/Vendors";
import Reviews from "./pages/Reviews";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Translation from "./pages/Translation"; // ✅ Import the Translation Page
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";
import axiosInstance from "./utils/axiosConfig"; // ✅ Ensure API requests include token

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    axiosInstance.get("/api/auth/profile/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <ThemeProvider>
      <Navbar user={user} setUser={setUser} /> {/* ✅ Navbar inside ThemeProvider */}
      <div className="app-container">
        {user && <Sidebar handleLogout={() => setUser(null)} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/map" element={<Map />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/translate" element={<Translation />} /> {/* ✅ Ensure this is present */}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

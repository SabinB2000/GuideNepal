// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import axiosInstance from "./utils/axiosConfig";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Vendors from "./pages/Vendors";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Translation from "./pages/Translation";
import Profile from "./pages/Profile";
import Itinerary from "./pages/Itinerary";
import Explore from "./pages/Explore";
import Reviews from "./pages/Reviews";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManagePlaces from "./pages/AdminManagePlaces";
import AdminManageItineraries from "./pages/AdminManageItineraries";
import AdminManageEvents from "./pages/AdminManageEvents";
import UserItineraryView from "./pages/UserItineraryView";
import AuthForm from "./components/AuthForm";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // On load, try to fetch the user profile using the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    axiosInstance
      .get("/auth/profile/me")
      .then((res) => {
        console.log("Profile endpoint returned:", res.data);
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
    <>
      {/* Show Navbar on public routes */}
      {!isAdminRoute && <Navbar openAuthForm={() => setShowAuthForm(true)} />}

      <div className="app-container">
        {/* Render Sidebar if user is logged in and not on an admin route */}
        {!isAdminRoute && user && (
          <Sidebar
            handleLogout={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }}
          />
        )}

        {/* Main content area */}
        <div className="main-content">
          <Routes>
            {/* Protected Routes */}
            <Route element={<PrivateRoute user={user} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/map" element={<Map />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/translate" element={<Translation />} />
            <Route path="/itinerary/:id" element={<UserItineraryView />} />

            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-manage-users" element={<AdminManageUsers />} />
            <Route path="/admin-manage-places" element={<AdminManagePlaces />} />
            <Route path="/admin-manage-itineraries" element={<AdminManageItineraries />} />
            <Route path="/admin-manage-events" element={<AdminManageEvents />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>

      {/* Render the AuthForm modal if no user */}
      {!user && showAuthForm && (
        <AuthForm closeAuth={() => setShowAuthForm(false)} setUser={setUser} user={user} />
      )}
    </>
  );
}

export default App;

import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";


import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthForm from "./components/AuthForm";
import PrivateRoute from "./components/PrivateRoute";
import VendorRoute from "./components/VendorRoute";

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
import UserItineraryView from "./pages/UserItineraryView";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManagePlaces from "./pages/AdminManagePlaces";
import AdminManageItineraries from "./pages/AdminManageItineraries";
import AdminManageEvents from "./pages/AdminManageEvents";

import VendorDashboard from "./pages/vendor/Dashboard";
import VendorPlaces from "./pages/vendor/Places";
import AddPlace from "./pages/vendor/AddPlace";
import PlaceForm from "./pages/vendor/PlaceForm";
import PlaceDetail from "./pages/vendor/PlaceDetail";
import ManageEvents from "./pages/vendor/ManageEvents";
import Settings from "./pages/vendor/Settings";

import "./index.css";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const isVendor = location.pathname.startsWith("/vendor");
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      {/* Navbar only on public pages */}
      {!user && !isAdmin && !isVendor && (
        <Navbar openAuth={() => setShowAuth(true)} />
      )}

      <div className="app-container">
        {/* Sidebar for logged-in regular users */}
        {user && !isAdmin && !isVendor && (
          <Sidebar />
        )}

        <div className="main-content">
          <Routes>
            {/* User-only protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/map" element={<Map />} />
            </Route>

            {/* Vendor-only protected routes */}
            <Route path="/vendor/*" element={<VendorRoute />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="places" element={<VendorPlaces />} />
              <Route path="places/new" element={<AddPlace />} />
              <Route path="places/:id" element={<PlaceDetail />} />
              <Route path="places/:id/edit" element={<PlaceForm />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/translate" element={<Translation />} />
            <Route path="/itinerary/:id" element={<UserItineraryView />} />

            {/* Admin routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-manage-users" element={<AdminManageUsers />} />
            <Route path="/admin-manage-places" element={<AdminManagePlaces />} />
            <Route path="/admin-manage-itineraries" element={<AdminManageItineraries />} />
            <Route path="/admin-manage-events" element={<AdminManageEvents />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Unified Auth Modal */}
      {!user && !isAdmin && !isVendor && showAuth && (
        <AuthForm closeAuth={() => setShowAuth(false)} />
      )}
    </>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; 
import Home from "./pages/Home";
import About from "./pages/About";
import Vendors from "./pages/Vendors";
import Reviews from "./pages/Reviews";
import Map from "./pages/Map";
import Translate from "./pages/Translate";
import Itineraries from "./pages/Itineraries";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "Traveler" });
    } else {
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      {user && <Sidebar />} {/* ✅ Show Sidebar only when logged in */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/map" element={<Map />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

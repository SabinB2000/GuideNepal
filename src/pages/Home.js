import React from "react";
import "../styles/Home.css";
import Navbar from "../components/Navbar"; // Import the Navbar separately

const Home = () => {
  return (
    <div className="homepage">
      

      {/* HERO SECTION */}
      <header className="hero">
        <div className="overlay">
          <h1 className="hero-title">GUIDE NEPAL</h1>
          <p className="hero-subtitle">
            Discover Nepal's beauty with personalized travel experiences.
          </p>
        </div>
      </header>

      {/* WONDERS OF NEPAL */}
      <section className="wonders">
        <h2>The Wonders of Nepal</h2>
        <p>Explore Nepal's top destinations with expert recommendations.</p>
        <div className="wonders-grid">
          <div className="card">
            <img src="../assets/background.jpg" alt="Mount Everest" />
            <h3>Mount Everest</h3>
            <p>Explore the world’s highest peak.</p>
          </div>
          <div className="card">
            <img src="../assets/background.jpg" alt="Chitwan National Park" />
            <h3>Chitwan National Park</h3>
            <p>Experience Nepal’s wildlife and jungles.</p>
          </div>
          <div className="card">
            <img src="../assets/background.jpg" alt="Pashupatinath Temple" />
            <h3>Pashupatinath Temple</h3>
            <p>Discover Nepal’s spiritual heritage.</p>
          </div>
          <div className="card">
            <img src="../assets/background.jpg" alt="Phewa Lake" />
            <h3>Phewa Lake</h3>
            <p>Relax by the peaceful lake in Pokhara.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE GUIDE NEPAL */}
      <section className="reasons">
        <h2>Why Choose Guide Nepal?</h2>
        <div className="reason-list">
          <div className="reason">✔️ Trusted by thousands of travelers</div>
          <div className="reason">📞 24/7 Reliable Support</div>
          <div className="reason">🗺️ One-stop travel partner</div>
        </div>
      </section>

      {/* PLAN YOUR TRIP */}
      <section className="vacation">
        <div className="vacation-content">
          <h2>Plan Your Perfect Trip</h2>
          <p>Whether you're looking for adventure, culture, or relaxation, Guide Nepal offers tailored itineraries for every traveler.</p>
          <button className="try-now-btn">Try Now</button>
        </div>
      </section>

      {/* EXPLORE NEPAL */}
      <section className="explore">
        <h2>Explore Nepal With Us</h2>
        <p>Navigate through the most scenic places and hidden gems Nepal has to offer.</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Guide Nepal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
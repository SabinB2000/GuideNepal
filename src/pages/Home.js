import React from "react";
import "../styles/Home.css";
import background from "../assets/background.jpg";

const Home = () => {
  return (
    <div className="homepage">
      {/* ✅ HERO SECTION */}
      <header className="hero" style={{ backgroundImage: `url(${background})` }}>
        <div className="overlay">
          <h1 className="hero-title">GUIDE NEPAL</h1>
          <p className="hero-subtitle">Discover Nepal's beauty with personalized travel experiences.</p>
        </div>
      </header>

      {/* ✅ WONDERS OF NEPAL */}
      <section className="wonders">
        <h2>The Wonders of Nepal</h2>
        <p>Explore Nepal's top destinations with expert recommendations.</p>
        <div className="wonders-grid">
          <div className="card">
            <img src={background} alt="Mount Everest" />
            <h3>Mount Everest</h3>
            <p>Explore the world’s highest peak.</p>
          </div>
          <div className="card">
            <img src={background} alt="Chitwan National Park" />
            <h3>Chitwan National Park</h3>
            <p>Experience Nepal’s wildlife and jungles.</p>
          </div>
          <div className="card">
            <img src={background} alt="Pashupatinath Temple" />
            <h3>Pashupatinath Temple</h3>
            <p>Discover Nepal’s spiritual heritage.</p>
          </div>
          <div className="card">
            <img src={background} alt="Phewa Lake" />
            <h3>Phewa Lake</h3>
            <p>Relax by the peaceful lake in Pokhara.</p>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <p>© 2025 Guide Nepal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

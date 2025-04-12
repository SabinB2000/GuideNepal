import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import AuthForm from "../components/AuthForm";
import PlaceModal from "../components/PlaceModal";
import "../styles/Home.css";

const UNSPLASH_ACCESS_KEY = "LIoaOeFaFZsQHpmN4LTFfCswzlOLjCMc27sC0ACS0gY";

const famousPlaces = [
  {
    name: "Swayambhunath",
    query: "Swayambhunath Kathmandu",
    description:
      "Swayambhunath, the Monkey Temple, offers panoramic views of the city and a peaceful stupa complex.",
  },
  {
    name: "Pashupatinath",
    query: "Pashupatinath Kathmandu",
    description:
      "Pashupatinath is one of the holiest Hindu temples in the world, set on the banks of the Bagmati River.",
  },
  {
    name: "Boudhanath",
    query: "Boudhanath Stupa Kathmandu",
    description:
      "Boudhanath is one of the largest spherical stupas in Nepal, a center of Tibetan Buddhism.",
  },
  {
    name: "Thamel",
    query: "Thamel Kathmandu",
    description:
      "Thamel is a vibrant tourist district, known for its shops, restaurants, and nightlife.",
  },
];

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();

  const openAuth = () => setShowAuth(true);
  const closeAuth = () => setShowAuth(false);

  const openPlace = (place) => setSelectedPlace(place);
  const closePlace = () => setSelectedPlace(null);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="home">
      

      {/* Hero */}
      <header className="hero">
        <ImageSlider
          accessKey={UNSPLASH_ACCESS_KEY}
          query="Kathmandu city"
          slides={5}
          className="hero-slider"
        />
        <div className="hero-overlay">
          <h1>GUIDE NEPAL</h1>
          <p>Your gateway to unforgettable Nepal adventures.</p>
          <button onClick={openAuth}>Explore Kathmandu</button>
        </div>
      </header>

      {/* Sub‑nav */}
      <nav className="subnav">
        <button onClick={() => scrollTo("places")}>Places</button>
        <button onClick={() => scrollTo("services")}>What We Do</button>
        <button onClick={() => scrollTo("reviews")}>Reviews</button>
        <button onClick={() => scrollTo("about")}>About Us</button>
      </nav>

      {/* Famous Places */}
      <section id="places" className="section places">
        <h2>Famous Places in Kathmandu</h2>
        <div className="places-grid">
          {famousPlaces.map((p) => (
            <div
              key={p.name}
              className="place-card"
              onClick={() => openPlace(p)}
            >
              <ImageSlider
                accessKey={UNSPLASH_ACCESS_KEY}
                query={p.query}
                slides={1}
                className="place-img"
              />
              <h3>{p.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section id="services" className="section services">
        <h2>What We Do</h2>
        <div className="services-grid">
          <div>
            <h3>Personalized Itineraries</h3>
            <p>Create trips tailored to your budget and interests.</p>
          </div>
          <div>
            <h3>Vendor Collaboration</h3>
            <p>Connect with local businesses for authentic experiences.</p>
          </div>
          <div>
            <h3>Real‑time Navigation</h3>
            <p>Stay on track with live maps and offline support.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="section reviews">
        <h2>Traveler Reviews</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>“An unforgettable journey through Kathmandu—highly recommended!”</p>
            <p className="author">— Alice</p>
          </div>
          <div className="review-card">
            <p>“The personalized itinerary was spot on. Loved every moment.”</p>
            <p className="author">— Bob</p>
          </div>
          <div className="review-card">
            <p>“Easy to use and discover hidden gems. Five stars!”</p>
            <p className="author">— Carla</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="section about">
        <h2>About Us</h2>
        <p>
          At Guide Nepal, we believe every traveler deserves a unique experience.
          From hidden temples to mountain vistas, we curate journeys that
          connect you to the heart of Nepal.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>© 2025 Guide Nepal</div>
        <div>
          <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && <AuthForm closeAuth={closeAuth} />}

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceModal place={selectedPlace} onClose={closePlace} />
      )}
    </div>
  );
}

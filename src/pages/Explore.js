import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import "../styles/Explore.css";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const UNSPLASH_ACCESS_KEY = "LIoaOeFaFZsQHpmN4LTFfCswzlOLjCMc27sC0ACS0gY";

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [placeImages, setPlaceImages] = useState({});
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [itinerary, setItinerary] = useState(null);

  const fetchPlaces = async () => {
    try {
      const res = await axiosInstance.get("/places/unique");
      setPlaces(res.data);
      fetchPlaceImages(res.data);
    } catch (err) {
      console.error("Place fetch error:", err);
    }
  };

  const fetchPlaceImages = async (places) => {
    const updatedImages = {};
    for (let place of places) {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${place.name}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
        );
        const data = await res.json();
        updatedImages[place._id] = data.results[0]?.urls?.regular || "";
      } catch (error) {
        console.error("Image fetch failed for:", place.name);
        updatedImages[place._id] = "";
      }
    }
    setPlaceImages(updatedImages);
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Location fetch failed. Using Kathmandu by default.");
        setUserLocation({ lat: 27.7172, lng: 85.324 });
      }
    );
  };

  const generateRoute = (destination) => {
    if (!userLocation || !destination) return;
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: destination.location,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const steps = result.routes[0].legs[0].steps.map((step) => ({
            instruction: step.instructions.replace(/<[^>]*>/g, ""),
            distance: step.distance.text,
            duration: step.duration.text,
          }));
          setNavigationSteps(steps);
        } else {
          console.error("Directions Error:", status);
        }
      }
    );
  };

  const handleCreateItinerary = () => {
    if (selectedPlace && directions) {
      setItinerary({
        from: userLocation,
        to: selectedPlace,
        steps: navigationSteps,
      });
    }
  };

  const resetItinerary = () => {
    setItinerary(null);
    setNavigationSteps([]);
    setDirections(null);
    setSelectedPlace(null);
  };

  useEffect(() => {
    fetchPlaces();
    getUserLocation();
  }, []);

  return (
    <div className="explore-container">
      <div className="explore-glass-background"></div>
      <h2>🗺️ Explore Unique Places in Nepal</h2>

      <button className="location-btn" onClick={getUserLocation}>
        📍 Detect My Location
      </button>

      {userLocation && (
        <p className="debug-coords">
          Your Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </p>
      )}

      <div className="place-list">
        {places.map((place) => (
          <div
            key={place._id}
            className={`place-card ${
              selectedPlace?._id === place._id ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedPlace(place);
              generateRoute(place);
              setItinerary(null);
            }}
          >
            <img
              src={placeImages[place._id] || `https://source.unsplash.com/400x200/?${place.category},nepal`}
              alt={place.title || place.name}
              className="place-img"
            />
            <div className="place-details">
            <h4>{place.title || place.name}</h4>
            <p>{place.description}</p>
              <span className="badge">{place.category}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedPlace && directions && (
        <div className="itinerary-controls">
          <button onClick={handleCreateItinerary} className="create-btn">
            📝 Create Itinerary to {selectedPlace.name}
          </button>
        </div>
      )}

      {itinerary && (
        <div className="itinerary-details">
          <h3>📍 Your Itinerary</h3>
          <p>
            From: {itinerary.from.lat.toFixed(4)}, {itinerary.from.lng.toFixed(4)}
            <br />
            To: {itinerary.to.name}
          </p>
          <ol>
            {itinerary.steps.map((step, idx) => (
              <li key={idx}>
                {step.instruction} ({step.distance}, {step.duration})
              </li>
            ))}
          </ol>
          <button className="reset-btn" onClick={resetItinerary}>Change Itinerary</button>
        </div>
      )}

      <div className="map-section">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || { lat: 27.7172, lng: 85.324 }}
            zoom={10}
          >
            {userLocation && <Marker position={userLocation} label="You" />}
            {places.map((place) => (
              <Marker key={place._id} position={place.location} />
            ))}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Explore;
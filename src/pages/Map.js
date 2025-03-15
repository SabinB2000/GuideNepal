//import ThemeContext, { useTheme } from "../context/ThemeContext"; // ✅ Fix importimport axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  TrafficLayer,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import ThemeContext, { useTheme } from "../context/ThemeContext"; // ✅ Fix importimport axios from "axios";
import "../styles/Map.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const Map = () => {
  const { isDark } = useContext(ThemeContext);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const watchIdRef = useRef(null);

  const startAutocomplete = useRef(null);
  const destAutocomplete = useRef(null);  

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  navigator.geolocation.getCurrentPosition(console.log, console.error);

  useEffect(() => {
    getCurrentLocation();
  }, [map]);

  // ✅ Locate Me Function
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          map?.panTo(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to fetch location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // ✅ Handle Autocomplete for Start & Destination
  const onPlaceChanged = (isStart) => {
    const autocomplete = isStart ? startAutocomplete.current : destAutocomplete.current;

    if (autocomplete && autocomplete.getPlace()) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = `${lat},${lng}`;
        isStart ? setStartLocation(location) : setDestination(location);
      }
    }
  };

  // ✅ Get Directions & Save Route Steps
  const calculateRoute = () => {
    if (!startLocation || !destination) {
      alert("Please enter both start and destination locations.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: startLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setRouteSteps(result.routes[0].legs[0].steps);
          setCurrentStepIndex(0); // ✅ Reset navigation progress
        } else {
          alert("Directions request failed. Try again.");
        }
      }
    );
  };

  // ✅ Start Navigation
  const startNavigation = () => {
    if (!directions || routeSteps.length === 0) {
      alert("Please calculate directions first!");
      return;
    }
  
    setNavigationActive(true);
  
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
  
        if (map) {
          map.panTo(newLocation); // ✅ Move map to user location
        }
  
        // ✅ Check if user reached next step
        const nextStep = routeSteps[currentStepIndex];
        if (nextStep) {
          const stepLocation = nextStep.start_location;
          const distance = getDistance(newLocation, {
            lat: stepLocation.lat(),
            lng: stepLocation.lng(),
          });
  
          console.log(`Distance to next step: ${distance}m`);
  
          if (distance < 30) {
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
            console.log("Moving to next step...");
          }
        }
      },
      (error) => console.error("Navigation error:", error),
      { enableHighAccuracy: true }
    );
  };
  

  // ✅ Stop Navigation
  const stopNavigation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setNavigationActive(false);
  };
  

  // ✅ Calculate Distance between Two Points
  const getDistance = (point1, point2) => {
    const R = 6371e3; // Earth radius in meters
    const lat1 = (point1.lat * Math.PI) / 180;
    const lat2 = (point2.lat * Math.PI) / 180;
    const deltaLat = lat2 - lat1;
    const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (!isLoaded) return <div className="loading">Loading Maps...</div>;
  if (loadError) return <div className="error">Google Maps failed to load</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        center={userLocation || { lat: 27.7172, lng: 85.324 }}
        zoom={13}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={{
          styles: isDark ? darkMapStyles : [],
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {showTraffic && <TrafficLayer autoUpdate />}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              scaledSize: new window.google.maps.Size(35, 35),
            }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* ✅ Controls UI */}
      <div className="controls">
        <Autocomplete onLoad={(a) => (startAutocomplete.current = a)} onPlaceChanged={() => onPlaceChanged(true)}>
          <input type="text" placeholder="Start location" className="search-bar" />
        </Autocomplete>
        <Autocomplete onLoad={(a) => (destAutocomplete.current = a)} onPlaceChanged={() => onPlaceChanged(false)}>
          <input type="text" placeholder="Destination" className="search-bar" />
        </Autocomplete>

        <div className="buttons">
          <button onClick={calculateRoute} className="route-button">🚗 Get Directions</button>
          <button onClick={getCurrentLocation} className="locate-button">📍 Locate Me</button>
          <button onClick={() => setShowTraffic(!showTraffic)}>{showTraffic ? "🚫 Hide Traffic" : "🚦 Show Traffic"}</button>
          {navigationActive ? (
            <button onClick={stopNavigation} className="stop-nav">🛑 Stop Navigation</button>
          ) : (
            <button onClick={startNavigation} className="start-nav">🧭 Start Navigation</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Dark Mode Map Styles
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#424242" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

export default Map;



// src/pages/Map.js
import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  TrafficLayer,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import "../styles/Map.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const Map = () => {
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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(loc);
          if (map) map.panTo(loc);
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Failed to fetch location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const onPlaceChanged = (isStart) => {
    const autocomplete = isStart ? startAutocomplete.current : destAutocomplete.current;
    if (autocomplete && autocomplete.getPlace()) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        isStart ? setStartLocation(`${lat},${lng}`) : setDestination(`${lat},${lng}`);
      }
    }
  };

  const calculateRoute = () => {
    if (!startLocation || !destination) {
      alert("Please enter both start and destination locations.");
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === "OK") {
          setDirections(res);
          setRouteSteps(res.routes[0].legs[0].steps);
          setCurrentStepIndex(0);
        } else {
          alert("Directions request failed. Try again.");
        }
      }
    );
  };

  const startNavigation = () => {
    if (!directions || routeSteps.length === 0) {
      alert("Please calculate directions first!");
      return;
    }
    setNavigationActive(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);
        if (map) map.panTo(newLoc);

        const nextStep = routeSteps[currentStepIndex];
        if (nextStep) {
          const stepLoc = nextStep.start_location;
          const dist = getDistance(newLoc, { lat: stepLoc.lat(), lng: stepLoc.lng() });
          if (dist < 30) setCurrentStepIndex((idx) => idx + 1);
        }
      },
      (err) => console.error("Navigation error:", err),
      { enableHighAccuracy: true }
    );
  };

  const stopNavigation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setNavigationActive(false);
  };

  const getDistance = (p1, p2) => {
    const R = 6371e3;
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (!isLoaded) return <div className="loading">Loading Maps...</div>;
  if (loadError) return <div className="error">Google Maps failed to load</div>;

  return (
    <div className="map-page">
      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "80vh" }}
          center={userLocation || { lat: 27.7172, lng: 85.324 }}
          zoom={13}
          onLoad={(mapInstance) => setMap(mapInstance)}
          options={{
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
      </div>

      <div className="map-controls">
        <div className="autocomplete-row">
          <Autocomplete
            onLoad={(auto) => (startAutocomplete.current = auto)}
            onPlaceChanged={() => onPlaceChanged(true)}
          >
            <input type="text" placeholder="Start location" className="search-bar" />
          </Autocomplete>
          <Autocomplete
            onLoad={(auto) => (destAutocomplete.current = auto)}
            onPlaceChanged={() => onPlaceChanged(false)}
          >
            <input type="text" placeholder="Destination" className="search-bar" />
          </Autocomplete>
        </div>
        <div className="buttons-row">
          <button onClick={calculateRoute}>🚗 Get Directions</button>
          <button onClick={getCurrentLocation}>📍 Locate Me</button>
          <button onClick={() => setShowTraffic(!showTraffic)}>
            {showTraffic ? "🚫 Hide Traffic" : "🚦 Show Traffic"}
          </button>
          {navigationActive ? (
            <button onClick={stopNavigation}>🛑 Stop Navigation</button>
          ) : (
            <button onClick={startNavigation}>🧭 Start Navigation</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;

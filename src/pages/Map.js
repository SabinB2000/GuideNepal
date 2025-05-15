import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  TrafficLayer,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import {
  FaCar,
  FaWalking,
  FaMapMarkerAlt,
  FaRoute,
  FaTrafficLight,
  FaCompass,
  FaStop,
  FaPlay,
  FaRedo,
} from "react-icons/fa";
import { IoMdNavigate } from "react-icons/io";
import { MdDirections, MdMyLocation } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Map.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const Map = () => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [distanceToNextStep, setDistanceToNextStep] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [isLocating, setIsLocating] = useState(false);

  const watchIdRef = useRef(null);
  const startAutocomplete = useRef(null);
  const destAutocomplete = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = parseFloat(params.get("lat"));
    const lng = parseFloat(params.get("lng"));
    const name = params.get("name");

    if (lat && lng) {
      setDestination({ lat, lng, name: name || "Destination" });
    }
  }, [location]);

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && startLocation && destination) {
      calculateRoute();
    }
  }, [isLoaded, startLocation, destination, travelMode]);

  useEffect(() => {
    if (routeSteps.length > 0 && currentStepIndex < routeSteps.length) {
      const step = routeSteps[currentStepIndex];
      setCurrentInstruction(step.instructions.replace(/<[^>]*>/g, ""));
      setDistanceToNextStep(step.distance.text);
    } else if (currentStepIndex >= routeSteps.length) {
      setCurrentInstruction("You have reached your destination!");
      stopNavigation();
    }
  }, [currentStepIndex, routeSteps]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(loc);
          setStartLocation(loc);
          if (map) {
            map.panTo(loc);
            map.setZoom(15);
          }
          setIsLocating(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Failed to fetch location. Please enable GPS.");
          const defaultLoc = { lat: 27.7172, lng: 85.324 };
          setUserLocation(defaultLoc);
          setStartLocation(defaultLoc);
          if (map) {
            map.panTo(defaultLoc);
            map.setZoom(13);
          }
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
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
        const loc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name || place.formatted_address,
        };
        if (isStart) {
          setStartLocation(loc);
        } else {
          setDestination(loc);
        }
      }
    }
  };

  const calculateRoute = () => {
    if (!isLoaded || !startLocation || !destination) {
      alert("Please ensure both start and destination locations are set.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
        provideRouteAlternatives: true,
      },
      (res, status) => {
        if (status === "OK") {
          setDirections(res);
          setRouteSteps(res.routes[0].legs[0].steps);
          setCurrentStepIndex(0);
          setCurrentInstruction(res.routes[0].legs[0].start_address);
          const bounds = new window.google.maps.LatLngBounds();
          res.routes[0].legs[0].steps.forEach((step) => {
            bounds.extend(step.start_location);
            bounds.extend(step.end_location);
          });
          if (map) map.fitBounds(bounds);
        } else {
          alert("Directions request failed. Please try again.");
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

        if (currentStepIndex < routeSteps.length) {
          const nextStep = routeSteps[currentStepIndex];
          const stepLoc = nextStep.start_location;
          const dist = getDistance(newLoc, { lat: stepLoc.lat(), lng: stepLoc.lng() });
          if (dist < 30) {
            setCurrentStepIndex((idx) => idx + 1);
          }
        }
      },
      (err) => console.error("Navigation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  };

  const stopNavigation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setNavigationActive(false);
  };

  const resetMap = () => {
    stopNavigation();
    setDirections(null);
    setRouteSteps([]);
    setCurrentStepIndex(0);
    setCurrentInstruction("");
    setDistanceToNextStep(null);
    setDestination(null);
    setStartLocation(userLocation);
    if (map) {
      map.panTo(userLocation || { lat: 27.7172, lng: 85.324 });
      map.setZoom(13);
    }
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

  if (!isLoaded)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Maps...</p>
      </div>
    );

  if (loadError)
    return (
      <div className="error-screen">
        <h2>⚠️ Google Maps failed to load</h2>
        <p>Please check your internet connection and try again.</p>
      </div>
    );

  return (
    <div className="map-app">
      <div className="map-header">
        <h1>
          <FaCompass className="header-icon" />
          Nepal Navigator
        </h1>
        <p>Find your way through Nepal's beautiful landscapes</p>
      </div>

      <div className="map-container">
        <div className="map-wrapper">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={userLocation || { lat: 27.7172, lng: 85.324 }}
            zoom={13}
            onLoad={(mapInstance) => setMap(mapInstance)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              mapTypeId: mapType,
              styles: [
                { featureType: "poi", stylers: [{ visibility: "off" }] },
                { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
              ],
            }}
          >
            {showTraffic && <TrafficLayer autoUpdate />}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
            {startLocation && startLocation !== userLocation && (
              <Marker
                position={startLocation}
                label={{ text: "A", color: "white", fontWeight: "bold" }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
            {destination && (
              <Marker
                position={destination}
                label={{ text: "B", color: "white", fontWeight: "bold" }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#3f51b5",
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        </div>

        <div className="controls-panel">
          <div className="search-container">
            <div className="search-group">
              <label>
                <FaMapMarkerAlt className="input-icon" /> Start Point
              </label>
              <button
                className="current-location-btn"
                onClick={getCurrentLocation}
              >
                {isLocating ? "Locating..." : "Use My Current Location"}
              </button>
              <Autocomplete
                onLoad={(auto) => (startAutocomplete.current = auto)}
                onPlaceChanged={() => onPlaceChanged(true)}
              >
                <input
                  type="text"
                  placeholder="Enter starting location"
                  className="search-input"
                  value={startLocation?.name || ""}
                  onChange={(e) => setStartLocation({ ...startLocation, name: e.target.value })}
                />
              </Autocomplete>
            </div>

            <div className="search-group">
              <label>
                <FaMapMarkerAlt className="input-icon" /> Destination
              </label>
              <Autocomplete
                onLoad={(auto) => (destAutocomplete.current = auto)}
                onPlaceChanged={() => onPlaceChanged(false)}
              >
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="search-input"
                  value={destination?.name || ""}
                  onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                />
              </Autocomplete>
            </div>
          </div>

          <div className="map-view-selector">
            <label htmlFor="mapType">Map View: </label>
            <select
              id="mapType"
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
            >
              <option value="roadmap">Roadmap</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>

          <div className="mode-selector">
            <button
              className={`mode-btn ${travelMode === "DRIVING" ? "active" : ""}`}
              onClick={() => setTravelMode("DRIVING")}
            >
              <FaCar /> Drive
            </button>
            <button
              className={`mode-btn ${travelMode === "WALKING" ? "active" : ""}`}
              onClick={() => setTravelMode("WALKING")}
            >
              <FaWalking /> Walk
            </button>
          </div>

          <div className="action-buttons">
            <button
              onClick={calculateRoute}
              className="action-btn primary"
              disabled={!startLocation || !destination}
            >
              <MdDirections /> Get Directions
            </button>
            <button onClick={getCurrentLocation} className="action-btn">
              <MdMyLocation /> Locate Me
            </button>
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`action-btn ${showTraffic ? "active" : ""}`}
            >
              <FaTrafficLight /> {showTraffic ? "Hide Traffic" : "Show Traffic"}
            </button>
            <button onClick={resetMap} className="action-btn reset">
              <FaRedo /> Reset
            </button>
          </div>

          {navigationActive ? (
            <button onClick={stopNavigation} className="action-btn danger">
              <FaStop /> Stop Navigation
            </button>
          ) : (
            <button
              onClick={startNavigation}
              className="action-btn success"
              disabled={!directions}
            >
              <FaPlay /> Start Navigation
            </button>
          )}

          {navigationActive && currentInstruction && (
            <div className="navigation-instruction">
              <div className="instruction-header">
                <IoMdNavigate className="nav-icon" />
                <h3>Current Instruction</h3>
              </div>
              <p>{currentInstruction}</p>
              {distanceToNextStep && (
                <p className="distance-info">Next step in {distanceToNextStep}</p>
              )}
              <div className="step-progress">
                Step {currentStepIndex + 1} of {routeSteps.length}
              </div>
            </div>
          )}

          {directions && !navigationActive && (
            <div className="route-summary">
              <h3>
                <FaRoute className="summary-icon" />
                Route Summary
              </h3>
              <div className="summary-item">
                <span>Distance:</span>
                <strong>{directions.routes[0].legs[0].distance.text}</strong>
              </div>
              <div className="summary-item">
                <span>Duration:</span>
                <strong>{directions.routes[0].legs[0].duration.text}</strong>
              </div>
              <div className="summary-item">
                <span>Mode:</span>
                <strong>{travelMode.toLowerCase()}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate }     from "react-router-dom";
import axiosInstance                  from "../utils/axiosConfig";
import Swal                           from "sweetalert2";
import { FiHeart, FiMapPin, FiX }     from "react-icons/fi";
import "../styles/PlaceDetail.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// fallback to Google Static Map
function staticMapUrl(lat, lng, size = "800x300") {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
         `&zoom=16&size=${size}&markers=color:red%7C${lat},${lng}` +
         `&key=${API_KEY}`;
}

export default function PlaceDetails() {
  const { placeId } = useParams();
  const nav         = useNavigate();

  const [place,         setPlace]         = useState(null);
  const [similar,       setSimilar]       = useState([]);
  const [pois,          setPois]          = useState([]);
  const [saved,         setSaved]         = useState(false);
  const [savedEntryId,  setSavedEntryId]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 1) load this place from your DB
        const { data: p } = await axiosInstance.get(`/places/db/${placeId}`);
        setPlace(p);

        // 2) get saved list & detect if this one is saved
        const { data: sl } = await axiosInstance.get("/saved-places");
        const me = sl.find(x => x.placeId === placeId);
        if (me) {
          setSaved(true);
          setSavedEntryId(me._id);
        } else {
          setSaved(false);
          setSavedEntryId(null);
        }

        // 3) fetch similar (same category)
        const { data: sim } = await axiosInstance.get(`/places/db/${placeId}/similar`);
        setSimilar(sim);

        // 4) fetch POIs around
        let lat, lng;
        if (p.location?.coordinates) {
          [lng, lat] = p.location.coordinates;
        } else if (p.geometry?.location) {
          lat = p.geometry.location.lat;
          lng = p.geometry.location.lng;
        }
        const { data: near } = await axiosInstance.get("/places/poi", { params: { lat, lng } });
        setPois(near);

      } catch (e) {
        console.error(e);
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [placeId]);

  const handleToggleSave = async () => {
    try {
      if (saved) {
        // unsave
        await axiosInstance.delete(`/saved-places/${savedEntryId}`);
        setSaved(false);
        setSavedEntryId(null);
        Swal.fire({ icon: "success", title: "Removed", timer: 800 });
      } else {
        // save
        const res = await axiosInstance.post("/saved-places", { placeId });
        setSaved(true);
        setSavedEntryId(res.data._id);
        Swal.fire({ icon: "success", title: "Saved!", timer: 1200 });
      }
    } catch (e) {
      if (e.response?.status === 401) {
        Swal.fire("Login required", "Please sign in to save places.", "warning");
        nav("/login");
      } else {
        Swal.fire("Error", e.response?.data?.message || e.message, "error");
      }
    }
  };

  const handleNavigate = () => {
    if (!place) return;
    let lat, lng;
    if (place.location?.coordinates) {
      [lng, lat] = place.location.coordinates;
    } else if (place.geometry?.location) {
      lat = place.geometry.location.lat;
      lng = place.geometry.location.lng;
    }
    nav(`/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(place.name)}`);
  };

  if (loading) return <div className="pd-overlay"><div className="pd-content"><p>Loading…</p></div></div>;
  if (error)   return <div className="pd-overlay"><div className="pd-content"><p className="error">{error}</p></div></div>;

  // hero image choice
  const heroImg =
    place.image ||
    (place.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
      : place.icon ||
        staticMapUrl(...(
          place.location?.coordinates ||
          [place.geometry.location.lng, place.geometry.location.lat]
        ).reverse()));

  return (
    <div className="pd-overlay" onClick={() => nav("/explore")}>
      <div className="pd-content" onClick={e => e.stopPropagation()}>
        <header className="pd-header">
          <h2>{place.name}</h2>
          <div className="pd-actions">
            <button
              onClick={handleToggleSave}
              className={`pd-btn save ${saved ? "saved" : ""}`}
            >
              <FiHeart /> {saved ? "Saved" : "Save"}
            </button>
            <button onClick={handleNavigate} className="pd-btn nav">
              <FiMapPin /> Navigate
            </button>
            <button onClick={() => nav("/explore")} className="pd-btn close">
              <FiX />
            </button>
          </div>
        </header>

        <div className="pd-hero">
          <img src={heroImg} alt={place.name} />
        </div>

        <section className="pd-details">
          <p>{place.description || place.formatted_address || "No description."}</p>
          {place.category && <p className="pd-cat"><strong>Category:</strong> {place.category}</p>}
        </section>

        <section className="pd-similar">
          <h3>Similar Places</h3>
          <div className="pd-grid">
            {similar.map(s => {
              const [lng, lat] = s.location.coordinates;
              const url = s.image || staticMapUrl(lat, lng, "400x200");
              return (
                <div key={s._id} className="pd-card" onClick={() => nav(`/explore/place/${s._id}`)}>
                  <img src={url} alt={s.name} />
                  <div className="pd-info"><h4>{s.name}</h4></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pd-pois">
          <h3>Points of Interest Nearby</h3>
          <div className="pd-grid">
            {pois.map(poi => {
              const lat = poi.geometry.location.lat;
              const lng = poi.geometry.location.lng;
              const url = poi.photos?.[0]?.photo_reference
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${poi.photos[0].photo_reference}&key=${API_KEY}`
                : poi.icon || staticMapUrl(lat, lng, "400x200");
              return (
                <div
                  key={poi.place_id}
                  className="pd-card"
                  onClick={() => nav(`/explore/place/${poi.place_id}`)}
                >
                  <img src={url} alt={poi.name} />
                  <div className="pd-info">
                    <h4>{poi.name}</h4>
                    {poi.vicinity && <p>{poi.vicinity}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

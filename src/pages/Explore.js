import React, { useState, useEffect } from "react";
import { useNavigate }                from "react-router-dom";
import axiosInstance                  from "../utils/axiosConfig";
import Swal                           from "sweetalert2";
import { FiHeart, FiMapPin }          from "react-icons/fi";
import "../styles/Explore.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// fallback to Google Static Map
function staticMapUrl(lat, lng, size = "400x200") {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
         `&zoom=15&size=${size}&markers=color:red%7C${lat},${lng}` +
         `&key=${API_KEY}`;
}

export default function Explore() {
  const nav = useNavigate();

  const [places,   setPlaces]   = useState([]);
  const [cats,     setCats]     = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savedMap, setSavedMap] = useState({});       // placeId → savedEntryId
  const [expanded, setExpanded] = useState({});
  const [search,   setSearch]   = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // load DB places + saved‐places
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [{ data: db }, { data: saved }] = await Promise.all([
          axiosInstance.get("/places/db"),
          axiosInstance.get("/saved-places"),
        ]);

        setPlaces(db);
        setCats([...new Set(db.map(p => p.category))]);

        // build saved sets
        const ids = new Set(saved.map(s => s.placeId));
        setSavedIds(ids);

        const map = {};
        saved.forEach(s => { map[s.placeId] = s._id; });
        setSavedMap(map);

      } catch (e) {
        console.error(e);
        setError("Couldn’t load places.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Google Places text-search
  const doSearch = async e => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const { data } = await axiosInstance.get("/places/google", {
        params: { query: search },
      });
      if (data.status !== "OK") throw new Error(data.status);

      setResults(
        data.results.map(p => ({
          id:       p.place_id,
          name:     p.name,
          category: p.types?.[0] || "Other",
          desc:     p.formatted_address,
          coords:   [p.geometry.location.lng, p.geometry.location.lat],
          photoRef: p.photos?.[0]?.photo_reference || null,
        }))
      );
      setError("");
    } catch (e) {
      console.error(e);
      setError("Search failed.");
      setResults([]);
    }
  };

  // toggle save ↔ unsave
  const toggleSave = async (placeId) => {
    if (savedIds.has(placeId)) {
      // unsave
      const entryId = savedMap[placeId];
      try {
        await axiosInstance.delete(`/saved-places/${entryId}`);
        setSavedIds(prev => {
          const c = new Set(prev);
          c.delete(placeId);
          return c;
        });
        setSavedMap(prev => {
          const c = { ...prev };
          delete c[placeId];
          return c;
        });
        Swal.fire({ icon: "success", title: "Removed", timer: 800 });
      } catch (e) {
        Swal.fire("Error", "Couldn’t remove place", "error");
      }
    } else {
      // save
      try {
        const res = await axiosInstance.post("/saved-places", { placeId });
        const entryId = res.data._id;
        setSavedIds(prev => new Set(prev).add(placeId));
        setSavedMap(prev => ({ ...prev, [placeId]: entryId }));
        Swal.fire({ icon: "success", title: "Saved!", timer: 1200 });
      } catch (e) {
        if (e.response?.status === 401) {
          Swal.fire("Login required", "Please sign in to save", "warning");
          nav("/login");
        } else {
          Swal.fire("Error", e.response?.data?.message || e.message, "error");
        }
      }
    }
  };

  const goMap = coords => {
    const [lng, lat] = coords;
    nav(`/map?lat=${lat}&lng=${lng}`);
  };

  if (loading) return <div className="explore-container"><p>Loading…</p></div>;
  if (error)   return <div className="explore-container"><p className="error">{error}</p></div>;

  // render a grid of cards
  const renderCards = (list, isSearch = false) => (
    <div className="places-grid">
      {list.map(p => {
        const id     = isSearch ? p.id : p._id;
        const coords = isSearch ? p.coords : p.location.coordinates;
        const img    = p.photoRef
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${p.photoRef}&key=${API_KEY}`
          : (isSearch
              ? staticMapUrl(coords[1], coords[0])
              : (p.image || staticMapUrl(coords[1], coords[0])));

        return (
          <div
            key={id}
            className="place-card"
            onClick={() => nav(`/explore/place/${id}`)}
          >
            <img src={img} alt={p.name} />
            <div className="place-info">
              <h3>{p.name}</h3>
              <p className="desc">{p.desc || p.formatted_address}</p>
              <p className="category">Category: {p.category}</p>
              <div className="card-actions">
                <button
                  className={`save-btn ${savedIds.has(id) ? "saved" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleSave(id); }}
                >
                  <FiHeart /> {savedIds.has(id) ? "Saved" : "Save"}
                </button>
                <button
                  className="nav-btn"
                  onClick={e => { e.stopPropagation(); goMap(coords); }}
                >
                  <FiMapPin /> Navigate
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="explore-container">
      <header className="explore-header">
        <h1>Explore Nepal</h1>
        <p>Discover the best places to visit</p>
        <form onSubmit={doSearch} className="search-form">
          <input
            className="search-input"
            placeholder="Search places…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>

      <main className="explore-main">
        {results.length > 0 && (
          <section className="search-results">
            <h2>Search Results</h2>
            {renderCards(results, true)}
          </section>
        )}

        {cats.map(cat => {
          const arr = places.filter(p => p.category === cat);
          const open = !!expanded[cat];
          const shown = open ? arr : arr.slice(0, 4);
          return (
            <section key={cat} className="category-section">
              <div className="category-header">
                <h2>{cat}</h2>
                <button
                  className="view-all"
                  onClick={() => setExpanded(x => ({ ...x, [cat]: !x[cat] }))}
                >
                  {open ? "Show Less" : "View All"}
                </button>
              </div>
              {renderCards(shown)}
            </section>
          );
        })}
      </main>
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './animepage.css';
import '../css_files/spinner.css';
import CurrentAnimeFeed from '../HomePage/Othercontents/currentanimefeed';
import SuggestedAnimeFeed from '../HomePage/Othercontents/suggestedanimefeed';
import API from "../../api";
import { AuthContext } from '../../context/AuthContext';

const AnimePage = () => {
  const { animeId } = useParams();
  const { user } = useContext(AuthContext);

  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [watchlistStatus, setWatchlistStatus] = useState(false);
  const [watchStatus, setWatchStatus] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  // Load anime details
  useEffect(() => {
    if (!animeId) return;

    setLoading(true);
    fetch(`https://api.jikan.moe/v4/anime?q=${animeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setAnimeData(data.data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [animeId]);

  // Auto-add to history.ALL when visiting anime page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !animeData) return;

    API.post("/weeb/history", {
      mal_id: animeData.mal_id,
      title: animeData.title,
      imageUrl: animeData.images.jpg.large_image_url
    }).catch(() => {});
  }, [animeData]);

  // Load current status from DB: watchlist, watching, completed
  useEffect(() => {
    if (!user || !animeData) return;

    const checkStatus = async () => {
      try {
        const [watchlistRes, watchingRes, completedRes] = await Promise.all([
          API.get("/weeb/watchlist"),
          API.get("/weeb/watching"),
          API.get("/weeb/completed")
        ]);

        const isInWatchlist = watchlistRes.data.some(a => a.mal_id === animeData.mal_id);
        const isInWatching = watchingRes.data.some(a => a.mal_id === animeData.mal_id);
        const isInCompleted = completedRes.data.some(a => a.mal_id === animeData.mal_id);

        setWatchlistStatus(isInWatchlist);

        if (isInCompleted) setWatchStatus("completed");
        else if (isInWatching) setWatchStatus("watching");
        else setWatchStatus(null);

      } catch (err) {
        console.error("Status load error:", err);
      }
    };

    checkStatus();
  }, [user, animeData]);

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    if (!user) return alert("Please login first");
    setActionLoading(true);

    try {
      await API.post("/weeb/watchlist", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });

      setWatchlistStatus(true);

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Move to watching
  const handleMarkAsWatching = async () => {
    if (!user) return alert("Please login first");
    setActionLoading(true);

    try {
      await API.post("/weeb/watching", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });

      setWatchStatus("watching");
      setWatchlistStatus(false);

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Move to completed
  const handleMarkAsCompleted = async () => {
    if (!user) return alert("Please login first");
    setActionLoading(true);

    try {
      await API.post("/weeb/completed", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });

      setWatchStatus("completed");
      setWatchlistStatus(false);

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Remove from watchlist only
  const handleRemoveFromWatchlist = async () => {
    setActionLoading(true);

    try {
      await API.delete(`/weeb/watchlist/${animeData.mal_id}`);
      setWatchlistStatus(false);

      if (watchStatus === "watching") setWatchStatus(null);

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="animepagecontainer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!animeData) return <div className="animepagecontainer">No data available</div>;

  return (
    <div className="animepagecontainer">

      {/* HERO SECTION */}
      <div className="anime-hero-section">
        <div className="anime-hero-backdrop" 
          style={{ backgroundImage: `url(${animeData.images.jpg.large_image_url})` }}>
        </div>

        <div className="anime-hero-content">
          <div className="anime-hero-wrapper">

            {/* POSTER */}
            <div className="anime-poster">
              <img src={animeData.images.jpg.large_image_url} alt={animeData.title} className="anime-poster-image" />
            </div>

            {/* RIGHT COLUMN INFO */}
            <div className="anime-main-info">
              
              <h1 className="anime-main-title">{animeData.title}</h1>

              {/* META TAGS centered */}
              <div className="anime-meta-tags" style={{ justifyContent: "center" }}>
                <span className="meta-tag rating">{animeData.rating?.split(" ")[0] || "N/A"}</span>
                <span className="meta-tag">{animeData.type || "TV"}</span>
                <span className="meta-tag">{animeData.year || "N/A"}</span>
                <span className="meta-tag score">⭐ {animeData.score || "N/A"}</span>
              </div>

              {/* GENRES centered */}
              <div className="anime-genres" style={{ justifyContent: "center" }}>
                {animeData.genres?.map((genre, idx) => (
                  <span key={idx} className="genre-tag">{genre.name}</span>
                ))}
              </div>

              <p className="anime-synopsis-main">{animeData.synopsis}</p>

              {/* ACTION BUTTONS (centered) */}
              <div className="anime-action-buttons" style={{ justifyContent: "center" }}>

                {/* COMPLETED */}
                {watchStatus === "completed" ? (
                  <>
                    <button className="action-btn completed-btn" disabled>✓ Completed</button>

                    <button
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsWatching}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : "Move to Watching"}
                    </button>
                  </>
                ) : null}

                {/* WATCHING */}
                {watchStatus === "watching" ? (
                  <>
                    <button className="action-btn watching-btn" disabled>⏵ Watching</button>

                    <button
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsCompleted}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : "Mark as Completed"}
                    </button>

                    {watchlistStatus && (
                      <button
                        className="action-btn remove-btn"
                        onClick={handleRemoveFromWatchlist}
                        disabled={actionLoading}
                      >
                        Remove from Watchlist
                      </button>
                    )}
                  </>
                ) : null}

                {/* DEFAULT STATE */}
                {watchStatus === null && (
                  <>
                    <button 
                      className="action-btn primary-btn"
                      onClick={handleAddToWatchlist}
                      disabled={actionLoading}
                    >
                      + Add to Watchlist
                    </button>

                    <button 
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsWatching}
                      disabled={actionLoading}
                    >
                      Mark as Watching
                    </button>

                    <button 
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsCompleted}
                      disabled={actionLoading}
                    >
                      Mark as Completed
                    </button>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="anime-details-section">
        <div className="details-grid">
          <div className="detail-item"><span className="detail-label">Japanese Title</span><span className="detail-value">{animeData.title_japanese || "N/A"}</span></div>
          <div className="detail-item"><span className="detail-label">Episodes</span><span className="detail-value">{animeData.episodes || "N/A"}</span></div>
          <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{animeData.status}</span></div>
          <div className="detail-item"><span className="detail-label">Aired</span><span className="detail-value">{animeData.aired?.string}</span></div>
          <div className="detail-item"><span className="detail-label">Season</span><span className="detail-value">{animeData.season} {animeData.year}</span></div>
          <div className="detail-item"><span className="detail-label">Duration</span><span className="detail-value">{animeData.duration}</span></div>
          <div className="detail-item"><span className="detail-label">Studios</span><span className="detail-value">{animeData.studios?.map(s => s.name).join(", ") || "N/A"}</span></div>
          <div className="detail-item"><span className="detail-label">Source</span><span className="detail-value">{animeData.source || "N/A"}</span></div>
        </div>
      </div>

      {/* FEEDS */}
      <div className="anime-recommendations-section">
        <h2 className="section-title">Currently Airing</h2>
        <CurrentAnimeFeed />
      </div>

      <div className="anime-recommendations-section">
        <h2 className="section-title">Popular Anime</h2>
        <SuggestedAnimeFeed />
      </div>

    </div>
  );
};

export default AnimePage;
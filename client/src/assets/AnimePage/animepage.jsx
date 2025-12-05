import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './animepage.css';
import '../css_files/spinner.css';
import CurrentAnimeFeed from '../HomePage/Othercontents/currentanimefeed';
import SuggestedAnimeFeed from '../HomePage/Othercontents/suggestedanimefeed';
import RelatedGenreFeed from '../HomePage/Othercontents/relatedgenrefeed';
import API from "../../api";
import { AuthContext } from '../../context/AuthContext';


const AnimePage = () => {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [watchlistStatus, setWatchlistStatus] = useState(false);
  const [watchStatus, setWatchStatus] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  // popup state for login prompt
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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

  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  const toggleWatchlist = async () => {
    if (!user) {
      openLoginPopup();
      return;
    }
    setActionLoading(true);

    try {
      if (!watchlistStatus) {
        await API.post("/weeb/watchlist", {
          mal_id: animeData.mal_id,
          title: animeData.title,
          imageUrl: animeData.images.jpg.large_image_url
        });
        setWatchlistStatus(true);
      } else {
        await API.delete(`/weeb/watchlist/${animeData.mal_id}`);
        setWatchlistStatus(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromWatching = async () => {
    if (!user) {
      openLoginPopup();
      return;
    }
    setActionLoading(true);

    try {
      await API.delete(`/weeb/watching/${animeData.mal_id}`);
      setWatchStatus(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsWatching = async () => {
    if (!user) {
      openLoginPopup();
      return;
    }
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

  const handleRemoveFromCompleted = async () => {
    if (!user) {
      openLoginPopup();
      return;
    }
    setActionLoading(true);

    try {
      await API.delete(`/weeb/completed/${animeData.mal_id}`);
      setWatchStatus(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!user) {
      openLoginPopup();
      return;
    }
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

      <div className="anime-hero-section">
        <div className="anime-hero-backdrop"
          style={{ backgroundImage: `url(${animeData.images.jpg.large_image_url})` }}>
        </div>

        <div className="anime-hero-content">
          <div className="anime-hero-wrapper">

            <div className="anime-poster">
              <img src={animeData.images.jpg.large_image_url} alt={animeData.title} className="anime-poster-image" />
            </div>

            <div className="anime-main-info">

              <h1 className="anime-main-title">{animeData.title}</h1>

              <div className="anime-meta-tags" style={{ justifyContent: "center" }}>
                <span className="meta-tag rating">{animeData.rating?.split(" ")[0] || "N/A"}</span>
                <span className="meta-tag">{animeData.type || "TV"}</span>
                <span className="meta-tag">{animeData.year || "N/A"}</span>
                <span className="meta-tag score">⭐ {animeData.score || "N/A"}</span>
              </div>

              <div className="anime-genres" style={{ justifyContent: "center" }}>
                {animeData.genres?.map((genre, idx) => (
                  <span key={idx} className="genre-tag">{genre.name}</span>
                ))}
              </div>

              <p className="anime-synopsis-main">{animeData.synopsis}</p>

              <div className="anime-action-buttons" style={{ justifyContent: "center" }}>

                {watchStatus === "completed" && (
                  <>
                    <button className="action-btn completed-btn" disabled>Completed</button>

                    <button
                      className="action-btn remove-btn"
                      onClick={handleRemoveFromCompleted}
                      disabled={actionLoading}
                    >
                      Remove from Completed
                    </button>

                    <button
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsWatching}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : "Move to Watching"}
                    </button>

                    <button
                      className={`action-btn ${watchlistStatus ? 'secondary-btn' : 'primary-btn'}`}
                      onClick={toggleWatchlist}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "..."
                        : watchlistStatus
                          ? "In Watchlist (Remove?)"
                          : "Add to Watchlist"}
                    </button>
                  </>
                )}

                {watchStatus === "watching" && (
                  <>
                    <button className="action-btn watching-btn" disabled>Watching</button>

                    <button
                      className="action-btn remove-btn"
                      onClick={handleRemoveFromWatching}
                      disabled={actionLoading}
                    >
                      Remove from Watching
                    </button>

                    <button
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsCompleted}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : "Mark as Completed"}
                    </button>

                    <button
                      className={`action-btn ${watchlistStatus ? 'secondary-btn' : 'primary-btn'}`}
                      onClick={toggleWatchlist}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "..."
                        : watchlistStatus
                          ? "In Watchlist (Remove?)"
                          : "Add to Watchlist"}
                    </button>
                  </>
                )}

                {watchStatus === null && (
                  <>
                    <button
                      className={`action-btn ${watchlistStatus ? 'secondary-btn' : 'primary-btn'}`}
                      onClick={toggleWatchlist}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "..."
                        : watchlistStatus
                          ? "In Watchlist (Remove?)"
                          : "Add to Watchlist"}
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

      <div className="anime-recommendations-section">
        <CurrentAnimeFeed />
      </div>

      <div className="anime-recommendations-section">
        <SuggestedAnimeFeed />
      </div>

      <div className="anime-recommendations-section">
        <RelatedGenreFeed genres={animeData.genres} />
      </div>

      {showLoginPopup && (
        <div className="login-popup-overlay" role="dialog" aria-modal="true">
          <div className="login-popup-card">
            <h3 className="login-popup-title">Please login first</h3>
            <p className="login-popup-desc">You need to be logged in to perform this action.</p>
            <div className="login-popup-actions">
              <button
                className="action-btn primary-btn"
                onClick={() => {
                  closeLoginPopup();
                  navigate('/login');
                }}
              >
                Login
              </button>
              <button
                className="action-btn secondary-btn"
                onClick={() => closeLoginPopup()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AnimePage;
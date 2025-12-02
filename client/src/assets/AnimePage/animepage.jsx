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
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchStatus, setWatchStatus] = useState(null); // 'watching' or 'completed'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!animeId) return;

    console.log("Fetching anime with title:", animeId);
    setLoading(true);
    fetch(`https://api.jikan.moe/v4/anime?q=${animeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setAnimeData(data.data[0]);
        } else {
          console.error("No anime found for:", animeId);
        }
      })
      .catch(err => console.error("Failed to fetch anime details:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [animeId]);

  // Add to history when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !animeData) return;

    API.post("/weeb/history", {
      mal_id: animeData.mal_id,
      title: animeData.title,
      imageUrl: animeData.images?.jpg?.large_image_url || "",
    }).catch(() => {});
  }, [animeData]);

  // Check if anime is in watchlist or completed
  useEffect(() => {
    if (!user || !animeData) return;

    const checkStatus = async () => {
      try {
        const [watchlistRes, completedRes] = await Promise.all([
          API.get("/weeb/watchlist"),
          API.get("/weeb/completed")
        ]);

        const inWatch = watchlistRes.data.some(anime => anime.mal_id === animeData.mal_id);
        const inCompleted = completedRes.data.some(anime => anime.mal_id === animeData.mal_id);

        setInWatchlist(inWatch);
        if (inCompleted) {
          setWatchStatus('completed');
        } else if (inWatch) {
          setWatchStatus('watching');
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    checkStatus();
  }, [user, animeData]);

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert("Please login to add to watchlist");
      return;
    }

    setActionLoading(true);
    try {
      await API.post("/weeb/watchlist", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });
      setInWatchlist(true);
      setWatchStatus('watching');
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      alert(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    setActionLoading(true);
    try {
      await API.delete(`/weeb/watchlist/${animeData.mal_id}`);
      setInWatchlist(false);
      if (watchStatus === 'watching') {
        setWatchStatus(null);
      }
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!user) {
      alert("Please login to mark as completed");
      return;
    }

    setActionLoading(true);
    try {
      await API.post("/weeb/completed", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });
      setWatchStatus('completed');
      // Remove from watchlist if it was there
      if (inWatchlist) {
        await API.delete(`/weeb/watchlist/${animeData.mal_id}`);
        setInWatchlist(false);
      }
    } catch (err) {
      console.error("Error marking as completed:", err);
      alert(err.response?.data?.message || "Failed to mark as completed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsWatching = async () => {
    if (!user) {
      alert("Please login to mark as watching");
      return;
    }

    setActionLoading(true);
    try {
      // Add to watchlist
      await API.post("/weeb/watchlist", {
        mal_id: animeData.mal_id,
        title: animeData.title,
        imageUrl: animeData.images.jpg.large_image_url
      });
      
      // Remove from completed if it was there
      if (watchStatus === 'completed') {
        await API.delete(`/weeb/completed/${animeData.mal_id}`);
      }
      
      setInWatchlist(true);
      setWatchStatus('watching');
    } catch (err) {
      console.error("Error marking as watching:", err);
      alert(err.response?.data?.message || "Failed to mark as watching");
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

  if (!animeData) return <div className="animepagecontainer">No data available.</div>;

  return (
    <div className="animepagecontainer">
      {/* Hero Section with Background */}
      <div className="anime-hero-section">
        <div className="anime-hero-backdrop" 
             style={{ backgroundImage: `url(${animeData.images.jpg.large_image_url})` }}>
        </div>
        <div className="anime-hero-content">
          <div className="anime-hero-wrapper">
            <div className="anime-poster">
              <img
                src={animeData.images.jpg.large_image_url}
                alt={animeData.title}
                className="anime-poster-image"
              />
            </div>

            <div className="anime-main-info">
              <h1 className="anime-main-title">{animeData.title}</h1>
              
              <div className="anime-meta-tags">
                <span className="meta-tag rating">{animeData.rating?.split(' ')[0] || 'N/A'}</span>
                <span className="meta-tag">{animeData.type || 'TV'}</span>
                <span className="meta-tag">{animeData.year || 'N/A'}</span>
                <span className="meta-tag score">⭐ {animeData.score || 'N/A'}</span>
              </div>

              <p className="anime-synopsis-main">{animeData.synopsis}</p>

              {/* Action Buttons */}
              <div className="anime-action-buttons">
                {watchStatus === 'completed' ? (
                  <>
                    <button className="action-btn completed-btn" disabled>
                      ✓ Completed
                    </button>
                    <button 
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsWatching}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Loading...' : 'Mark as Watching'}
                    </button>
                  </>
                ) : watchStatus === 'watching' ? (
                  <>
                    <button className="action-btn watching-btn" disabled>
                      ⏵ Watching
                    </button>
                    <button 
                      className="action-btn secondary-btn"
                      onClick={handleMarkAsCompleted}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Loading...' : 'Mark as Completed'}
                    </button>
                    <button 
                      className="action-btn remove-btn"
                      onClick={handleRemoveFromWatchlist}
                      disabled={actionLoading}
                    >
                      Remove from List
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="action-btn primary-btn"
                      onClick={handleAddToWatchlist}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Loading...' : '+ Add to Watchlist'}
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

              <div className="anime-genres">
                {animeData.genres?.map((genre, idx) => (
                  <span key={idx} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="anime-details-section">
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Japanese Title</span>
            <span className="detail-value">{animeData.title_japanese || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Episodes</span>
            <span className="detail-value">{animeData.episodes || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value">{animeData.status}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Aired</span>
            <span className="detail-value">{animeData.aired?.string}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Season</span>
            <span className="detail-value">{animeData.season} {animeData.year}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{animeData.duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Studios</span>
            <span className="detail-value">
              {animeData.studios?.map(s => s.name).join(', ') || 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Source</span>
            <span className="detail-value">{animeData.source || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="anime-recommendations-section">
        <CurrentAnimeFeed />
      </div>

      <div className="anime-recommendations-section">
        <SuggestedAnimeFeed />
      </div>
    </div>
  );
};

export default AnimePage;
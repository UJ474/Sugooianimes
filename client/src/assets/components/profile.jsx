import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api";
import "../css_files/profile.css";
import monitorplay from "../images/monitor-play.png";
import historyimage from '../images/history.png';


export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    watchlistCount: 0,
    historyCount: 0,
    completedCount: 0,
  });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchUserStats();
  }, [user, loading, navigate]);

  const fetchUserStats = async () => {
    try {
      const calls = [
        API.get("/weeb/watchlist"),
        API.get("/weeb/watching"),
        API.get("/weeb/completed"),
      ];

      const [watchlistRes, historyRes, completedRes] = await Promise.all(calls);

      setStats({
        watchlistCount: Array.isArray(watchlistRes.data) ? watchlistRes.data.length : 0,
        historyCount: Array.isArray(historyRes.data) ? historyRes.data.length : 0,
        completedCount: Array.isArray(completedRes.data) ? completedRes.data.length : 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // keeping previous values if error
    }
  };

  if (loading) return null;

  // If user is still null → redirect triggered above
  if (!user) return null;

  const isOnMainProfile = location.pathname === "/profile";
  const activeTab = location.pathname.includes("watchlist")
    ? "watchlist"
    : location.pathname.includes("history")
    ? "history"
    : "";

  return (
    <div className="profile-page">
      <div className="profile-container" style={{ boxShadow: "none" }}>
        <div className="profile-header" style={{ boxShadow: "none" }}>
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span style={{ textShadow: "none" }}>{user.username?.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-username-row">
              <h1 className="profile-username" style={{ textShadow: "none" }}>{user.username}</h1>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number" style={{ textShadow: "none" }}>{stats.watchlistCount}</span>
                <span className="stat-label" style={{ textShadow: "none" }}>Watchlist</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ textShadow: "none" }}>{stats.historyCount}</span>
                <span className="stat-label" style={{ textShadow: "none" }}>Watching</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ textShadow: "none" }}>{stats.completedCount}</span>
                <span className="stat-label" style={{ textShadow: "none" }}>Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs" style={{ boxShadow: "none" }}>
          <Link
            to="/profile/watchlist"
            className={`profile-tab ${activeTab === "watchlist" ? "active" : ""}`}
            onMouseOver={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
            onFocus={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
            onMouseDown={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
          >
            <img
              src={monitorplay}
              alt="Watchlist Icon"
              style={{
                width: "22px",
                height: "22px",
                objectFit: "contain",
                opacity: 0.7,
                filter: "none"
              }}
            />
            <span style={{ textShadow: "none" }}>WATCHLIST</span>
          </Link>

          <Link
            to="/profile/history"
            className={`profile-tab ${activeTab === "history" ? "active" : ""}`}
            onMouseOver={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
            onFocus={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
            onMouseDown={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
          >
            <img
              src={historyimage}
              alt="History Icon"
              style={{
                width: "22px",
                height: "22px",
                objectFit: "contain",
                opacity: 0.7,
                filter: "none"
              }}
            />
            <span style={{ textShadow: "none" }}>HISTORY</span>
          </Link>
        </div>

        <div className="profile-content">
          {isOnMainProfile ? (
            <div className="profile-empty-state" style={{ boxShadow: "none" }}>

              <h2 style={{ textShadow: "none" }}>Welcome to Your Profile</h2>
              <p style={{ textShadow: "none" }}>Start building your anime collection</p>

              <div className="empty-state-actions">
                <Link 
                  to="/profile/watchlist" 
                  className="empty-state-btn"
                  onMouseOver={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                  onFocus={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                  onMouseDown={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                >
                  <span style={{  textShadow: "none" }} _hover={{ color:'black'}}>View Watchlist</span>
                </Link>
                <Link 
                  to="/" 
                  className="empty-state-btn secondary"
                  onMouseOver={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                  onFocus={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                  onMouseDown={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.textShadow="none"; }}
                >
                  <span style={{ textShadow: "none" }}>Browse Anime</span>
                </Link>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
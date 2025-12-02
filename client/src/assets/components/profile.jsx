import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../css_files/profile.css';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [stats, setStats] = useState({
        watchlistCount: 0,
        historyCount: 0,
        completedCount: 0
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserStats();
    }, [user, navigate]);

    const fetchUserStats = async () => {
        try {
            // future real API call
            setStats({
                watchlistCount: 0,
                historyCount: 0,
                completedCount: 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!user) return null;

    // detect active tabs
    const isOnMainProfile = location.pathname === '/profile';
    const activeTab =
        location.pathname.includes('watchlist')
            ? 'watchlist'
            : location.pathname.includes('history')
            ? 'history'
            : '';

    return (
        <div className="profile-page">
            <div className="profile-container">
                
                {/* HEADER */}
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-username-row">
                            <h1 className="profile-username">{user.username}</h1>
                        </div>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{stats.watchlistCount}</span>
                                <span className="stat-label">Watchlist</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.historyCount}</span>
                                <span className="stat-label">Watched</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.completedCount}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                        </div>

                        <div className="profile-bio">
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-description">
                                Anime enthusiast • Discovering new worlds
                            </p>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="profile-tabs">
                    <Link
                        to="/profile/watchlist"
                        className={`profile-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
                    >
                        <span className="tab-icon">📺</span> WATCHLIST
                    </Link>

                    <Link
                        to="/profile/history"
                        className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
                    >
                        <span className="tab-icon">🕐</span> HISTORY
                    </Link>
                </div>

                {/* CONTENT */}
                <div className="profile-content">
                    {isOnMainProfile ? (
                        <div className="profile-empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h2>Welcome to Your Profile</h2>
                            <p>Start building your anime collection</p>

                            <div className="empty-state-actions">
                                <Link to="/profile/watchlist" className="empty-state-btn">
                                    View Watchlist
                                </Link>
                                <Link to="/" className="empty-state-btn secondary">
                                    Browse Anime
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
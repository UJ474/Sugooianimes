import { Link } from 'react-router-dom';
import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import '../../App.css'
import '../css_files/headersection.css'
import searchImage from '../images/searchimage.png';
import savedImage from '../images/savedimage.png';
import accountImage from '../images/accountimage.png';
import hamburgerimage from '../images/hamburgerimage.png';
import sugooianimelogo from '../images/sugooianimelogo2.png';


export default function Header() {
    const headerTextLinksLeft = [
        { heading: 'Home', path: '/' },
        { heading: 'New', path: '/current' },
        { heading: 'Most Popular', path: '/suggested' },
        { heading: 'Genre', path: '/filter' },
    ];

    const headerTextLinksRight = [
        { image: savedImage, alt: 'Saved' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    const { user, logout } = useContext(AuthContext);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setProfileMenuOpen(prev => !prev);
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 2) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
                const data = await res.json();
                setSearchResults(data.data || []);
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search/${searchQuery.trim()}`);
            setSearchResults([]);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        navigate('/');
    };

    const handleProfileMenuClick = (path) => {
        setProfileMenuOpen(false);
        navigate(path);
    };

    return (
        <nav className="headersectionmain">
            <div className="navbarleftcontainer">
                <img src={hamburgerimage} alt='hamburger' className='hamburgerimage' onClick={toggleMobileMenu}/>
                <Link to='/' className='logo-link'>
                    <img src={sugooianimelogo} alt='logo' className='sugooianimelogo'/>
                </Link>
                <div className="nav-links-desktop">
                    {headerTextLinksLeft.map((item, i) => (
                        <Link to={item.path} key={i} className='navbarleft'>{item.heading}</Link>
                    ))}
                </div>
                {mobileMenuOpen && (
                    <div className="mobilemenu show">
                        {headerTextLinksLeft.map((item, i) => (
                            <Link to={item.path} key={i} onClick={handleMobileLinkClick} className="mobile-link">{item.heading}</Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="searchbarcontainer">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleKeyPress}
                    placeholder="Search anime..."
                    className="searchinput"
                  />
                  <img src={searchImage} alt="Search" className="searchinput-icon" />
                </div>
                {searchResults.length > 0 && (
                    <div className="searchdropdown">
                        {searchResults.map(anime => (
                            <div
                                key={anime.mal_id}
                                className="searchitem"
                                onClick={() => {
                                    navigate(`/anime/${anime.title}`);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                            >
                                {anime.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="navbarrightcontainer">
                <div className="header-icons">
                    {headerTextLinksRight.map((item, i) => (
                        <button key={i} className="icon-btn" title={item.alt}>
                            <img src={item.image} alt={item.alt} className='navbarright' />
                        </button>
                    ))}
                </div>

                <div className="auth-section">
                    {user ? (
                        <div className="user-info" ref={profileMenuRef}>
                            <button 
                                className="profile-button" 
                                onClick={toggleProfileMenu}
                                aria-label="Profile menu"
                            >
                                <img src={accountImage} alt="Profile" className='profile-icon' />
                            </button>
                            
                            {profileMenuOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="profile-dropdown-avatar">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="profile-dropdown-info">
                                            <p className="profile-dropdown-name">{user.username}</p>
                                            <p className="profile-dropdown-email">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="profile-dropdown-divider"></div>
                                    
                                    <button 
                                        className="profile-dropdown-item"
                                        onClick={() => handleProfileMenuClick('/profile')}
                                    >
                                        <span className="profile-dropdown-icon">👤</span>
                                        My Profile
                                    </button>
                                    
                                    <button 
                                        className="profile-dropdown-item"
                                        onClick={() => handleProfileMenuClick('/profile/watchlist')}
                                    >
                                        <span className="profile-dropdown-icon">📺</span>
                                        Watchlist
                                    </button>
                                    
                                    <button 
                                        className="profile-dropdown-item"
                                        onClick={() => handleProfileMenuClick('/profile/history')}
                                    >
                                        <span className="profile-dropdown-icon">🕐</span>
                                        History
                                    </button>
                                    
                                    <div className="profile-dropdown-divider"></div>
                                    
                                    <button 
                                        className="profile-dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <span className="profile-dropdown-icon">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="auth-link login-link">Login</Link>
                            <Link to="/signup" className="auth-link signup-link">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
}
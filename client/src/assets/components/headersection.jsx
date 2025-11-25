import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
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
        // { image: searchImage, alt: 'Search' },
        { image: savedImage, alt: 'Saved' },
        { image: accountImage, alt: 'Account' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { user, logout } = useContext(AuthContext);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
    };

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
    navigate('/');
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
                        <div className="user-info">
                            <span className="username">{user.username}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
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

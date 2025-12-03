import '../css_files/footersection.css';
import { Link } from 'react-router-dom';
import sugooianimelogo from '../images/sugooianimelogo2.png';


export default function Footer() {
    return (
        <footer className="footer-main">
            <div className="footer-container">
                {/* Logo and Description Section */}
                <div className="footer-section footer-brand">
                    <div className="footer-logo">
                        <img src={sugooianimelogo} alt="Sugooianime Logo" />
                    </div>
                    <p className="footer-tagline">
                        Welcome to Sugooianime, your ultimate destination for searching the best in anime entertainment.
                    </p>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Explore</h3>
                    <ul className="footer-links">
                        <li><Link to="/suggested">Browse Popular</Link></li>
                        <li><Link to="/current">Currently Airing</Link></li>
                        <li><Link to="/filter">Genres</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Resources</h3>
                    <ul className="footer-links">
                        <li><Link >About</Link></li>
                        <li><Link >Help Center</Link></li>
                        <li><Link >Contact</Link></li>
                        <li><Link >Press Inquiries</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Account</h3>
                    <ul className="footer-links">
                        <li><Link >Start a Free Trial</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><Link to="/profile/watchlist">Watchlist</Link></li>
                        <li><Link to="/profile/history">History</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="footer-copyright">© 2025 Sugooianime. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link >Terms of Use</Link>
                        <span className="footer-separator">•</span>
                        <Link >Privacy Policy</Link>
                        <span className="footer-separator">•</span>
                        <Link >Cookie Consent</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
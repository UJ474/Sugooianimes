import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AnimeCard from '../components/animecard.jsx';
import './searchresult.css';
import '../css_files/spinner.css';
import { useNavigate } from 'react-router-dom';

function capitalizeQuery(str) {
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError(null);

    const searchQuery = query.trim();
    
    fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&sfw=true`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch results');
        return res.json();
      })
      .then(data => {
        setResults(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Search error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.mal_id}`, {
      state: {
        animeData: {
          title: anime.title_english || anime.title,
          title_japanese: anime.title_japanese,
          imageUrl: anime.images.jpg.large_image_url,
          synopsis: anime.synopsis,
          score: anime.score,
          mal_id: anime.mal_id
        }
      }
    });
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <div className="search-header-content">
          <svg className="search-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <div>
            <h1 className="search-title">Search Results</h1>
            <p className="search-query">
              Showing results for: <span className="query-text">{query}</span>
            </p>
          </div>
        </div>
        
        {!loading && !error && (
          <div className="results-count">
            <span className="count-number">{results.length}</span>
            <span className="count-label">{results.length === 1 ? 'result' : 'results'}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Searching for anime...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <svg className="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="no-results-container">
          <svg className="no-results-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 className="no-results-title">No anime found</h3>
          <p className="no-results-message">
            We couldn't find any anime matching "<strong>{query}</strong>"
          </p>
          <div className="suggestions">
            <p className="suggestions-title">Try:</p>
            <ul className="suggestions-list">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Searching for the Japanese title</li>
              <li>Using more general terms</li>
            </ul>
          </div>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="filteredanimecontainer">
          {results.map(anime => (
            <AnimeCard
              key={anime.mal_id}
              animeId={anime.mal_id}
              title={anime.title_english || anime.title}
              imageUrl={anime.images.jpg.large_image_url}
              synopsis={anime.synopsis}
              rating={anime.score}
            />
          ))}
        </div>
      )}
    </div>
  );
}
import React from 'react';
import './genrepage.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GenreSearch from './genresearch';

const GenrePage = () => {
  const location = useLocation();
  const genres = [
    "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi",
    "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai", "Josei", "Kids",
    "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police",
    "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo",
    "Shoujo Ai", "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports",
    "Super Power", "Supernatural", "Thriller", "Vampire"
  ];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);

  useEffect(() => {
    if (location.state?.preselectedGenres) {
      setSelectedGenres(location.state.preselectedGenres);
      setShowFiltered(true);
    }
  }, [location.state]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setShowFiltered(false);
  };

  const handleFilter = () => {
    if (selectedGenres.length > 0) {
      setShowFiltered(true);
    }
  };

  const handleClearAll = () => {
    setSelectedGenres([]);
    setShowFiltered(false);
  };

  return (
    <div className="genre-page-container">
      <div className="breadcrumb">
        <span>Home</span>
        <span>•</span>
        <span className="breadcrumb-current">Filter by Genre</span>
      </div>

      <div className="filter-box">
        <h2 className="filter-title">Select Genres</h2>

        <div className="genre-section">
          <div className="genre-list">
            {genres.map((genre, index) => (
              <span
                className={`genre-tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                key={index}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="filter-button-container">
          {selectedGenres.length > 0 && (
            <>
              <div className="selected-count">
                <span>{selectedGenres.length}</span>
                <span>Genre{selectedGenres.length > 1 ? 's' : ''} Selected</span>
              </div>
              <button className="clear-button" onClick={handleClearAll}>
                Clear All
              </button>
            </>
          )}
          <button 
            className="filter-button" 
            onClick={handleFilter}
            disabled={selectedGenres.length === 0}
          >
            {selectedGenres.length === 0 ? 'Select Genres to Filter' : 'Apply Filter'}
          </button>
        </div>
      </div>

      {showFiltered && selectedGenres.length > 0 && (
        <GenreSearch selectedGenre={selectedGenres} />
      )}

      {!showFiltered && selectedGenres.length === 0 && (
        <div className="genre-message">
          <p>✨ Select one or more genres to discover amazing anime!</p>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
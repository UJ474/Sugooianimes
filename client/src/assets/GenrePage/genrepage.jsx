import React from 'react';
import './genrepage.css';
import { useState } from 'react';
import GenreSearch from './genresearch';

const GenrePage = () => {
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
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span>
        <span>•</span>
        <span className="breadcrumb-current">Filter by Genre</span>
      </div>

      {/* Filter Box */}
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

        {/* Action Buttons */}
        <div className="filter-button-container">
          <button 
            className="filter-button" 
            onClick={handleFilter}
            disabled={selectedGenres.length === 0}
            >
            {selectedGenres.length === 0 ? 'Select Genres to Filter' : 'Apply Filter'}
          </button>
            {selectedGenres.length > 0 && (
              <>
                <button className="clear-button" onClick={handleClearAll}>
                  Clear All
                </button>
              </>
            )}
        </div>
      </div>

      {/* Results */}
      {showFiltered && selectedGenres.length > 0 && (
        <GenreSearch selectedGenre={selectedGenres} />
      )}

      {/* Empty State */}
      {!showFiltered && selectedGenres.length === 0 && (
        <div className="genre-message">
          <p>Select one or more genres to discover amazing anime!</p>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
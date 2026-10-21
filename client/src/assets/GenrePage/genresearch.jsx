import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/animecard.jsx';
import Pagination from '../../components/Pagination.jsx';
import '../css_files/spinner.css';
import { getAnimeByGenre } from '../../services/kitsuService.js';

const GenreSearch = ({ selectedGenre }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!selectedGenre || selectedGenre.length === 0) return;
    
    setCurrentPage(1);
  }, [selectedGenre]);

  useEffect(() => {
    if (!selectedGenre || selectedGenre.length === 0) return;

    const fetchAnimeByGenres = async () => {
      setLoading(true);
      try {
        const genreQuery = selectedGenre.join(',');
        const data = await getAnimeByGenre(genreQuery, currentPage, 20);
        setAnimeList(data || []);
        setTotalPages(data?.totalPages || 1);
      } catch (error) {
        console.error('Error fetching anime:', error);
        setAnimeList([]);
      }
      setLoading(false);
    };

    fetchAnimeByGenres();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedGenre, currentPage]);

  if (!selectedGenre || selectedGenre.length === 0) {
    return <div className="genre-message">Please select a genre.</div>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="genre-search-container">
      <h2 className="genre-search-title">Anime in Genres: {selectedGenre.join(', ')}</h2>
      
      <div className="filteredanimecontainer">
        {animeList.map(anime => (
          <AnimeCard
            key={anime.mal_id}
            animeId={anime.mal_id}
            title={anime.title_english || anime.title}
            imageUrl={anime.images.jpg.large_image_url}
            synopsis={anime.synopsis}
            rating={anime.score}
            status={anime.status}
            genres={anime.genres}
            episodes={anime.episodes}
          />
        ))}
      </div>

      {animeList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default GenreSearch;

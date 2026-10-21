import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AnimeCard from '../components/animecard';
import '../css_files/spinner.css';
import './specificgenre.css';


const genreMap = {
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  dementia: 5,
  demons: 6,
  mystery: 7,
  drama: 8,
  ecchi: 9,
  fantasy: 10,
  game: 11,
  hentai: 12,
  historical: 13,
  horror: 14,
  kids: 15,
  magic: 16,
  martial_arts: 17,
  mecha: 18,
  music: 19,
  parody: 20,
  samurai: 21,
  romance: 22,
  school: 23,
  sci_fi: 24,
  shoujo: 25,
  shoujo_ai: 26,
  shounen: 27,
  shounen_ai: 28,
  space: 29,
  sports: 30,
  super_power: 31,
  vampire: 32,
  yaoi: 33,
  yuri: 34,
  harem: 35,
  slice_of_life: 36,
  supernatural: 37,
  military: 38,
  police: 39,
  psychological: 40,
  thriller: 41,
  seinen: 42,
  josei: 43,
  isekai: 62
};




import { getAnimeByGenre } from '../../services/kitsuService.js';
import Pagination from '../../components/Pagination.jsx';

export default function SpecificGenre() {
  const { genreName } = useParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenreAnime = async () => {
      if (!genreName) return;
      setLoading(true);
      try {
        const formatted = await getAnimeByGenre(genreName, currentPage, 20);
        setAnimes(formatted || []);
        setTotalPages(formatted?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch genre-specific anime:", error);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGenreAnime();
  }, [genreName, currentPage]);

  return (
    <div className="specificgenrepage">
      <h2 className="genreheading">{genreName} Anime</h2>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="animegrid">
          {animes.map((anime, index) => (
            <AnimeCard
              key={anime.mal_id || index}
              animeId={anime.mal_id}
              title={anime.title}
              imageUrl={anime.imageUrl}
              synopsis={anime.synopsis}
              rating={anime.rating}
              status={anime.status}
              genres={anime.genres}
              episodes={anime.episodes}
            />
          ))}
        </div>
      )}

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

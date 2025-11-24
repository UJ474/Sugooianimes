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




export default function SpecificGenre() {
  const { genreName } = useParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchRef = useRef(false);

  useEffect(() => {
    const fetchGenreAnime = async () => {
      setLoading(true);
      try {
        const genreId = genreMap[genreName && genreName.toLowerCase()];
        if (!genreId) {
          console.error('Invalid genre key');
          setAnimes([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity&page=${currentPage}`);
        const data = await res.json();
        const formatted = data.data.map(anime => ({
          title: anime.title_english || anime.title,
          imageUrl: anime.images?.jpg?.large_image_url,
          synopsis: anime.synopsis,
          rating: anime.score,
        }));
        setAnimes(formatted);
      } catch (error) {
        console.error("Failed to fetch genre-specific anime:", error);
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
              key={index}
              title={anime.title}
              imageUrl={anime.imageUrl}
              synopsis={anime.synopsis}
              rating={anime.rating}
            />
          ))}
        </div>
      )}
      <div style={{ marginTop: '3rem' }}>
        <button
          className="changebuttons"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Prev
        </button>
        {Array.from({ length: 10 }, (_, i) => {
          const startPage = Math.max(currentPage - 5, 1);
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`pagebutton ${currentPage === pageNum ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className="changebuttons"
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
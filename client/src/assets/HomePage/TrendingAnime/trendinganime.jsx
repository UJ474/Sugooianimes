import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import trendingdata from "./trendingdata.jsx";
import SynopsisText from "./synopsistext.jsx";
import './trendinganime.css'
import '../../css_files/spinner.css';

import img1 from './TrendingAssests/frieren.png'
import img2 from './TrendingAssests/fullmetal.png'
import img3 from './TrendingAssests/steinsgate.png'
import img4 from './TrendingAssests/onepiecefanletter.png'
import img5 from './TrendingAssests/attackontitan.png'
import img6 from './TrendingAssests/gintama4.png'
import img7 from './TrendingAssests/gintamafinal.png'
import img8 from './TrendingAssests/hunterxhunter.png'
import img9 from './TrendingAssests/gintama2.png'
import img10 from './TrendingAssests/gintamaen.png'



const genreList = [
  { name: 'Action', key: 'action' },
  { name: 'Adventure', key: 'adventure' },
  { name: 'Cars', key: 'cars' },
  { name: 'Comedy', key: 'comedy' },
  { name: 'Dementia', key: 'dementia' },
  { name: 'Demons', key: 'demons' },
  { name: 'Drama', key: 'drama' },
  { name: 'Ecchi', key: 'ecchi' },
  { name: 'Fantasy', key: 'fantasy' },
  { name: 'Game', key: 'game' },
  { name: 'Harem', key: 'harem' },
  { name: 'Historical', key: 'historical' },
  { name: 'Horror', key: 'horror' },
  { name: 'Isekai', key: 'isekai' },
  { name: 'Josei', key: 'josei' },
  { name: 'Kids', key: 'kids' },
  { name: 'Magic', key: 'magic' },
  { name: 'Martial Arts', key: 'martial_arts' },
  { name: 'Mecha', key: 'mecha' },
  { name: 'Military', key: 'military' },
  { name: 'Music', key: 'music' },
  { name: 'Mystery', key: 'mystery' },
  { name: 'Parody', key: 'parody' },
  { name: 'Police', key: 'police' },
  { name: 'Psychological', key: 'psychological' },
  { name: 'Romance', key: 'romance' },
  { name: 'Samurai', key: 'samurai' },
  { name: 'School', key: 'school' },
  { name: 'Sci-Fi', key: 'sci_fi' },
  { name: 'Seinen', key: 'seinen' },
  { name: 'Shoujo', key: 'shoujo' },
  { name: 'Shounen', key: 'shounen' },
  { name: 'Slice of Life', key: 'slice_of_life' },
  { name: 'Space', key: 'space' },
  { name: 'Sports', key: 'sports' },
  { name: 'Super Power', key: 'super_power' },
  { name: 'Supernatural', key: 'supernatural' },
  { name: 'Thriller', key: 'thriller' },
  { name: 'Vampire', key: 'vampire' },
];



export default function TrendingAnime() {
    const [topAnime, setTopAnime] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const fetchRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const imagelinks = [
        img1, img2, img3, img4, img5, img6, img7, img8, img9, img10
    ]

    useEffect(() => {
        // localStorage.removeItem('trendingAnime');
        // localStorage is a Web API that allows you to store key-value pairs in the browser and the data persists even after the page is refreshed or the browser is closed.

        const storedData = localStorage.getItem('trendingAnime');
    
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const now = new Date().getTime();
            const oneday = 24 * 60 * 60 * 1000;
    
            if (now - parsedData.timestamp < oneday) {
                setTopAnime(parsedData.data);
                trendingdata.length = 0;
                trendingdata.push(...parsedData.data);
                setLoading(false);
            } else {
                localStorage.removeItem('trendingAnime');
                fetchAndStoreTrendingAnime();
            }
        } else {
            fetchAndStoreTrendingAnime();
        }
    
        fetchRef.current = true;
    }, []);
    
    function fetchAndStoreTrendingAnime() {
        setLoading(true);
        fetch("https://api.jikan.moe/v4/top/anime")
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const topTen = data.data.slice(0, 10).map(anime => ({
                        title: anime.title,
                        title_english: anime.title_english,
                        score: anime.score,
                        imageUrl: anime.images.jpg.large_image_url,
                        url: anime.url,
                        synopsis: anime.synopsis,
                        genres: anime.genres,
                        title_japanese: anime.title_japanese,
                        aniimages: anime.images,
                        themes: anime.themes
                    }));
                    setTopAnime(topTen);
                    trendingdata.length = 0;
                    trendingdata.push(...topTen);
                    localStorage.setItem('trendingAnime', JSON.stringify({
                        data: topTen,
                        timestamp: new Date().getTime()
                    }));
                }
            })
            .catch(error => {
                console.error("Error fetching trending anime:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (topAnime.length > 0) {
            const interval = setInterval(() => {
                setPrevIndex(currentIndex);
                setCurrentIndex((prevIndex) => (prevIndex + 1) % topAnime.length);
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [topAnime, currentIndex]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <>
        <div className="trendingheroslider">
            <div className="herosliderimages">
            {prevIndex !== null && (
                <img
                    src={imagelinks[prevIndex]}
                    alt="Previous Slide"
                    className="slide-image fade-out"
                />
            )}
            {topAnime.length > 0 && (
                <img
                    src={imagelinks[currentIndex]}
                    alt="Current Slide"
                    className="slide-image fade-in"
                />
            )}

            </div>
            <div className="trendingherosliderdata content-fade-in" style={{marginTop: '6rem', padding: '4rem 3rem'}}>
            {topAnime.length > 0 && (
                <>
                <p style={{fontSize:'36px', paddingBottom:'2.5rem', marginTop:'8rem', fontWeight:'700', textShadow:'0 0 12px rgba(255,255,255,0.35)'}}>{topAnime[currentIndex].title_japanese}</p>
                <p style={{fontSize:'1.1rem', opacity:'0.75', marginBottom:'1rem', letterSpacing:'0.5px'}}>{topAnime[currentIndex].title}</p>
                {/* <p style={{padding:'0.5rem'}}> {topAnime[currentIndex].score}</p> */}
                <div style={{padding:'0.5rem'}}>
                {topAnime[currentIndex].genres.map((gen) => (
                  <Link
                    to={`/genre/${gen.name.toLowerCase().replace(/\s+/g, '_')}`}
                    key={gen.name}
                    state={{ genreKey: gen.name.toLowerCase().replace(/\s+/g, '_'), genreName: gen.name }}
                    style={{ marginRight: "8px", textDecoration: 'none', color: 'inherit' }}
                    className="genretag"
                  >
                    {gen.name}
                  </Link>
                ))}
                </div>
                
                {/* {topAnime[currentIndex].themes.map((obj) => (
                <a href={obj.url} key={obj.mal_id} style={{ marginRight: "8px", textDecoration: 'none', color: 'inherit' }} className="genre-tag">
                    {obj.name}
                </a>
                ))} */}
                <SynopsisText text={topAnime[currentIndex].synopsis} />
                </>
            )}
            </div>

        </div>
        </>
    );
}

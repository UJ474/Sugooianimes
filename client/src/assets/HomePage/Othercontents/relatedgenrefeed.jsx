import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import AnimeRow from '../../components/AnimeRow';
import '../../css_files/spinner.css';
import './homepageother.css';

const genreMap = {
  Action: 1, Adventure: 2, Comedy: 4, Drama: 8, Fantasy: 10,
  Horror: 14, Mystery: 7, Romance: 22, "Sci-Fi": 24, 
  Supernatural: 37, Thriller: 41, Sports: 30, Slice: 36
};

const SingleGenreFeed = ({ genre }) => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!genre) return;

        const key = `genre_feed_v2_${genre.name}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (now - parsed.timestamp < oneDay) {
                setAnimeList(parsed.data);
                setLoading(false);
                return;
            }
        }

        fetchAndStoreGenreAnime();
    }, [genre]);

    async function fetchAndStoreGenreAnime() {
        setLoading(true);
        const key = `genre_feed_v2_${genre.name}`;

        try {
            const genreId = genreMap[genre.name] || genre.mal_id;
            if (!genreId) {
                setLoading(false);
                return;
            }

            const response = await fetch(
                `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=10`
            );
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const list = data.data.map(anime => ({
                    title: anime.title,
                    title_english: anime.title_english,
                    score: anime.score,
                    imageUrl: anime.images.jpg.large_image_url,
                    synopsis: anime.synopsis,
                    genres: anime.genres,
                    status: anime.status,
                    episodes: anime.episodes
                }));

                setAnimeList(list);

                localStorage.setItem(
                    key,
                    JSON.stringify({
                        data: list,
                        timestamp: Date.now()
                    })
                );
            } else {
                const saved = localStorage.getItem(key);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setAnimeList(parsed.data);
                }
            }
        } catch (err) {
            console.error(`Error fetching ${genre.name}:`, err);

            const key = `genre_feed_v2_${genre.name}`;
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                setAnimeList(parsed.data);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleShowMore = () => {
        navigate("/filter", {
            state: { preselectedGenres: [genre.name] }
        });
    };

    if (!loading && animeList.length === 0) {
        return null;
    }

    return (
        <AnimeRow 
            title={`More ${genre.name} Anime`} 
            animeList={animeList} 
            loading={loading} 
            onShowMore={handleShowMore} 
        />
    );
};

const RelatedGenreFeed = ({ genres = [] }) => {
    if (!genres || genres.length === 0) return null;

    return (
        <>
            {genres.map((genre, index) => (
                <SingleGenreFeed key={`${genre.name}-${index}`} genre={genre} />
            ))}
        </>
    );
};

export default RelatedGenreFeed;
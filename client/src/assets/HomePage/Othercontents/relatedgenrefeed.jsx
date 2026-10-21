import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import AnimeRow from '../../components/AnimeRow';
import '../../css_files/spinner.css';
import './homepageother.css';
import { getAnimeByGenre } from '../../../services/kitsuService.js';

const SingleGenreFeed = ({ genre, fetchDelay = 0 }) => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!genre) return;

        const key = `genre_feed_v4_${genre.name}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (now - parsed.timestamp < oneDay && parsed.data?.length > 0) {
                    setAnimeList(parsed.data);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // ignore
            }
        }

        const timer = setTimeout(() => fetchAndStoreGenreAnime(), fetchDelay);
        return () => clearTimeout(timer);
    }, [genre, fetchDelay]);

    async function fetchAndStoreGenreAnime() {
        setLoading(true);
        const key = `genre_feed_v4_${genre.name}`;

        try {
            const list = await getAnimeByGenre(genre.name, 1, 10);
            if (list && list.length > 0) {
                setAnimeList(list);
                localStorage.setItem(
                    key,
                    JSON.stringify({
                        data: list,
                        timestamp: Date.now()
                    })
                );
            }
        } catch (err) {
            console.error(`Error fetching ${genre.name}:`, err);
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
                <SingleGenreFeed key={`${genre.name}-${index}`} genre={genre} fetchDelay={index * 500} />
            ))}
        </>
    );
};

export default RelatedGenreFeed;

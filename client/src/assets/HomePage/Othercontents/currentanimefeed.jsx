import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimeRow from '../../components/AnimeRow';
import '../../css_files/spinner.css';
import './homepageother.css';

const CurrentAnimeFeed = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentStoredData = localStorage.getItem('home_current_top_10');
        
        if (currentStoredData) {
            const parsedData = JSON.parse(currentStoredData);
            const now = Date.now();
            const oneday = 24 * 60 * 60 * 1000;

            if (now - parsedData.timestamp < oneday) {
                setAnimeList(parsedData.data);
                setLoading(false);
                return;
            }
        }
        fetchAndStoreCurrentAnime();
    }, []);
    
    function fetchAndStoreCurrentAnime() {
        setLoading(true);

        fetch('https://api.jikan.moe/v4/seasons/now?page=1')
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const top30 = data.data.slice(0, 20).map(anime => ({
                        title: anime.title,
                        title_english: anime.title_english,
                        score: anime.score,
                        imageUrl: anime.images.jpg.large_image_url,
                        url: anime.url,
                        synopsis: anime.synopsis,
                        genres: anime.genres,
                        title_japanese: anime.title_japanese,
                        aniimages: anime.images,
                        themes: anime.themes,
                        episodes: anime.episodes,
                    }));

                    setAnimeList(top30);

                    localStorage.setItem(
                        'home_current_top_10',
                        JSON.stringify({
                            data: top30,
                            timestamp: Date.now()
                        })
                    );
                }
            })
            .catch(error => console.log("Error fetching current anime:", error))
            .finally(() => setLoading(false));
    }

    const handleShowMore = () => {
        navigate("/current");
    };

    return (
        <AnimeRow 
            title="Currently Airing" 
            animeList={animeList.slice(0, 10)} 
            loading={loading} 
            onShowMore={handleShowMore} 
        />
    );
};

export default CurrentAnimeFeed;
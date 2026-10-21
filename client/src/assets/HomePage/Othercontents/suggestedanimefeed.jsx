import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimeRow from '../../components/AnimeRow';
import '../../css_files/spinner.css';
import './homepageother.css';
import { getTopAnime } from '../../../services/kitsuService.js';

const SuggestedAnimeFeed = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentStoredData = localStorage.getItem('home_suggested_top_10_v3');

        if (currentStoredData) {
            try {
                const parsedData = JSON.parse(currentStoredData);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (now - parsedData.timestamp < oneDay && parsedData.data?.length > 0) {
                    setAnimeList(parsedData.data);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // ignore
            }
        }

        fetchAndStoreSuggestedAnime();
    }, []);

    async function fetchAndStoreSuggestedAnime() {
        setLoading(true);
        try {
            const list = await getTopAnime(1, 20);
            if (list && list.length > 0) {
                setAnimeList(list);
                localStorage.setItem(
                    'home_suggested_top_10_v3',
                    JSON.stringify({
                        data: list,
                        timestamp: Date.now(),
                    })
                );
            }
        } catch (err) {
            console.error("Error fetching suggested anime:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleShowMore = () => {
        navigate("/suggested");
    };

    return (
        <AnimeRow 
            title="Suggested" 
            animeList={animeList.slice(0, 10)} 
            loading={loading} 
            onShowMore={handleShowMore} 
        />
    );
};

export default SuggestedAnimeFeed;

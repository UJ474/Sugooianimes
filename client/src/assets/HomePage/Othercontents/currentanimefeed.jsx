import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimeRow from '../../components/AnimeRow';
import '../../css_files/spinner.css';
import './homepageother.css';
import { getCurrentAnime } from '../../../services/kitsuService.js';

const CurrentAnimeFeed = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentStoredData = localStorage.getItem('home_current_top_10_v3');
        
        if (currentStoredData) {
            try {
                const parsedData = JSON.parse(currentStoredData);
                const now = Date.now();
                const oneday = 24 * 60 * 60 * 1000;

                if (now - parsedData.timestamp < oneday && parsedData.data?.length > 0) {
                    setAnimeList(parsedData.data);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // ignore
            }
        }
        fetchAndStoreCurrentAnime();
    }, []);
    
    async function fetchAndStoreCurrentAnime() {
        setLoading(true);
        try {
            const list = await getCurrentAnime(1, 20);
            if (list && list.length > 0) {
                setAnimeList(list);
                localStorage.setItem(
                    'home_current_top_10_v3',
                    JSON.stringify({
                        data: list,
                        timestamp: Date.now()
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching current anime:", error);
        } finally {
            setLoading(false);
        }
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

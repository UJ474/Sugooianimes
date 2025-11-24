import React, { useState, useEffect } from 'react';
import { Box, Text, Flex } from "@chakra-ui/react";
import AnimeCard from '../../components/animecard';
import '../../css_files/spinner.css';
import './homepageother.css';

const CurrentAnimeFeed = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentStoredData = localStorage.getItem('currentanimesdata');
        if (currentStoredData) {
            const parsedData = JSON.parse(currentStoredData);
            const now = new Date().getTime();
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
                    localStorage.setItem('currentanimesdata', JSON.stringify({
                        data: top30,
                        timestamp: new Date().getTime()
                    }));
                }
            })
            .catch(error => {
                console.log("Error fetching current anime:", error);
            })
            .finally(() => setLoading(false));
    }

    if (loading) {
        return (
            <Flex justify="center" align="center" height="300px">
                <div className="loading-spinner"></div>
            </Flex>
        );
    }

    return (
        <Box mt="3rem" mb="1rem" >
            <Text
                className='fancyheading'
                pl="20px"
                textAlign="left"
                fontSize="3xl"
                fontWeight="800"
                letterSpacing="wide"
                bgGradient="linear(to-r, brand.400, brand.100)"
                bgClip="text"
                // textShadow="0 0 20px rgba(82,125,255,0.6)"
                // mb="1rem"
            >
                Currently Airing
            </Text>

            <Flex
                // className="animescroll"
                overflowX="auto"
                gap="10px"
                pl="20px"
                pb="10px"
            >
                {animeList.slice(0, 10).map((anime, index) => (
                    <Box key={index} flex="0 0 auto">
                        <AnimeCard
                            title={anime.title}
                            imageUrl={anime.imageUrl}
                            synopsis={anime.synopsis ?? "No synopsis available"}
                            rating={anime.score ?? "N/A"}
                        />
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default CurrentAnimeFeed;

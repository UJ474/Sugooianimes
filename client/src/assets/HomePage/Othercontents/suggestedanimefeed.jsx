import React, { useState, useEffect } from 'react';
import { Box, Text, Flex } from "@chakra-ui/react";
import AnimeCard from '../../components/animecard';
import '../../css_files/spinner.css';
import './homepageother.css';

const SuggestedAnimeFeed = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentStoredData = localStorage.getItem('home_suggested_top_10');

        if (currentStoredData) {
            const parsedData = JSON.parse(currentStoredData);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (now - parsedData.timestamp < oneDay) {
                setAnimeList(parsedData.data);
                setLoading(false);
                return;
            }
        }

        fetchAndStoreSuggestedAnime();
    }, []);

    function fetchAndStoreSuggestedAnime() {
        setLoading(true);

        fetch('https://api.jikan.moe/v4/top/anime?filter=favorite&page=1')
            .then(res => res.json())
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
                        'home_suggested_top_10',
                        JSON.stringify({
                            data: top30,
                            timestamp: Date.now(),
                        })
                    );
                }
            })
            .catch(err => console.log("Error fetching suggested anime:", err))
            .finally(() => setLoading(false));
    }

    return (
        <Box mt="3rem" mb="1rem">
            <Text
                className="fancyheading"
                pl="20px"
                textAlign="left"
                fontSize="3xl"
                fontWeight="800"
                letterSpacing="wide"
                bgGradient="linear(to-r, brand.400, brand.100)"
                bgClip="text"
            >
                Suggested
            </Text>

            {/* Skeleton shimmer loading (same as CurrentAnimeFeed) */}
            {loading && (
                <div style={{ padding: "2rem", width: "100%" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {Array.from({ length: animeList.length || 25 }).map((_, i) => (
                            <div key={i} className="skeleton-card"></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actual list (same layout as current anime feed) */}
            {!loading && (
                <Flex
                    className="animescroll"
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
            )}
        </Box>
    );
};

export default SuggestedAnimeFeed;

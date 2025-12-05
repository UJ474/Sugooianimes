import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import AnimeCard from '../../components/animecard';
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

        const key = `genre_feed_${genre.name}`;
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
        const key = `genre_feed_${genre.name}`;

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
                    genres: anime.genres
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

            const key = `genre_feed_${genre.name}`;
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
        <Box mt="3rem" mb="1rem">
            <Flex
                align="center"
                justify="space-between"
                pl="20px"
                pr="20px"
                mb="1rem"
                flexWrap="wrap"
                gap="1rem"
            >
                <Text
                    className="fancyheading"
                    fontSize="3xl"
                    fontWeight="800"
                    letterSpacing="wide"
                    bgGradient="linear(to-r, brand.400)"
                    bgClip="text"
                >
                    More {genre.name} Anime
                </Text>

                <Button
                    onClick={handleShowMore}
                    size="md"
                    bg="linear-gradient(50deg, #4924eefb)"
                    color="white"
                    _hover={{
                        filter: "brightness(0.95)",
                        transform: "translateY(-2px)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    borderRadius="full"
                    px="6"
                    textShadow="none"
                    boxShadow="none"
                >
                    Show More →
                </Button>
            </Flex>

            {/* Skeleton */}
            {loading && (
                <div style={{ padding: "2rem" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="skeleton-card"></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Anime list */}
            {!loading && animeList.length > 0 && (
                <Flex
                    className="animescroll"
                    overflowX="auto"
                    gap="10px"
                    pl="20px"
                    pb="10px"
                >
                    {animeList.map((anime, i) => (
                        <Box key={i} flex="0 0 auto">
                            <AnimeCard
                                title={anime.title_english || anime.title}
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
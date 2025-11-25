import { useEffect, useState } from "react";
import currentanimedata from './currentanimedata.jsx';
import AnimeCard from "../components/animecard.jsx";
import '../css_files/spinner.css';
import './currentanime.css';
import { Box, Button, Flex } from "@chakra-ui/react";

export default function CurrentAnimes() {
    const [currentAnimes, setCurrentAnimes] = useState([]);
    const [loading, setLoading] = useState(true);

    // initialize page from localStorage so pagination works across navigation
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Look for cached page data for the currently selected page
        const storedData = localStorage.getItem('current_airing_page_data');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                // Use cached data only if it was stored for the same page and is fresh
                if (parsedData.page === currentPage && (now - parsedData.timestamp < oneDay)) {
                    setCurrentAnimes(parsedData.data || []);
                    currentanimedata.length = 0;
                    currentanimedata.push(...(parsedData.data || []));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // ignore parse errors and fetch fresh
                console.warn('Failed to parse cached current airing data:', err);
            }
        }

        // if cache is missing or stale, fetch the current page
        fetchAndStoreCurrentAnime(currentPage);
    }, [currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    function fetchAndStoreCurrentAnime(page) {
        setLoading(true);
        fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}`)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const top30 = data.data.slice(0, 30).map(anime => ({
                        title: anime.title,
                        title_english: anime.title_english,
                        score: anime.score,
                        imageUrl: anime.images?.jpg?.large_image_url,
                        url: anime.url,
                        synopsis: anime.synopsis,
                        genres: anime.genres,
                        title_japanese: anime.title_japanese,
                        aniimages: anime.images,
                        themes: anime.themes,
                        episodes: anime.episodes,
                    }));
                    setCurrentAnimes(top30);
                    currentanimedata.length = 0;
                    currentanimedata.push(...top30);

                    // cache per-page data with timestamp and page number
                    try {
                        localStorage.setItem('current_airing_page_data', JSON.stringify({
                            data: top30,
                            timestamp: Date.now(),
                            page: page
                        }));
                    } catch (err) {
                        console.warn('Failed to cache current airing page data:', err);
                    }
                } else {
                    // if API returned empty, clear list
                    setCurrentAnimes([]);
                }
            })
            .catch(error => {
                console.log("Error fetching current anime:", error);
            })
            .finally(() => setLoading(false));
    }


    // if (loading) {
    //     return (
    //         <div style={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             height: "400px"
    //         }}>
    //             <div className="loading-spinner"></div>
    //         </div>
    //     );
    // }

    return (
        <>
        {loading && (
            <div style={{ padding: "2rem", width: "100%" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem"
                    }}
                >
                    {Array.from({ length: currentAnimes.length || 25 }).map((_, i) => (
                        <div key={i} className="skeleton-card"></div>
                    ))}
                </div>
            </div>
        )}

        {!loading && (
            <div className="suggested-anime-list">
                {currentAnimes.map((anime, index) => (
                    <AnimeCard
                        key={index}
                        title={anime.title_english || anime.title}
                        imageUrl={anime.imageUrl}
                        synopsis={anime.synopsis}
                        rating={anime.score}
                    />
                ))}
            </div>
        )}

        <Flex justify="center" align="center" gap="10px" mt="3rem">
            <Button
                colorScheme="blue"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: "white", color: "black" }}
                isDisabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
                Prev
            </Button>

            {Array.from({ length: 10 }, (_, i) => {
                const startPage = Math.max(currentPage - 5, 1);
                const pageNum = startPage + i;

                return (
                    <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        variant={currentPage === pageNum ? "solid" : "outline"}
                        colorScheme={currentPage === pageNum ? "pink" : undefined}

                        // text color
                        color={currentPage === pageNum ? "white" : "white"}

                        // hover styles
                        _hover={
                            currentPage === pageNum
                                ? { bg: "blue", color: "white" }
                                : { bg: "white", color: "black" }
                        }

                        // border color for outline version
                        borderColor={currentPage === pageNum ? "pink.500" : "white"}
                    >
                        {pageNum}
                    </Button>
                );
            })}


            <Button
                colorScheme="blue"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: "white", color: "black" }}
                onClick={() => setCurrentPage(prev => prev + 1)}
            >
                Next
            </Button>
        </Flex>
        </>
    );
}
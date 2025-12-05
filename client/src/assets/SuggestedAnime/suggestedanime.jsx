import { useEffect, useState } from "react";
import suggestedanimedata from './suggestedanimedata.jsx';
import AnimeCard from "../components/animecard.jsx";
import '../css_files/spinner.css';
import './suggestedanime.css';
import { Flex, Button } from "@chakra-ui/react";

export default function SuggestedAnime() {
    const [suggestedAnimes, setSuggestedAnimes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const storedData = localStorage.getItem("suggested_page_cache");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (parsed.page === currentPage && now - parsed.timestamp < oneDay) {
                    setSuggestedAnimes(parsed.data || []);
                    suggestedanimedata.length = 0;
                    suggestedanimedata.push(...(parsed.data || []));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Cache parse failed:", err);
            }
        }

        fetchAndStore(currentPage);
    }, [currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    function fetchAndStore(page) {
        setLoading(true);
        fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}`)
            .then(res => res.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const top30 = data.data.slice(0, 30).map(anime => ({
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

                    setSuggestedAnimes(top30);
                    suggestedanimedata.length = 0;
                    suggestedanimedata.push(...top30);

                    localStorage.setItem(
                        "suggested_page_cache",
                        JSON.stringify({
                            data: top30,
                            timestamp: Date.now(),
                            page: page,
                        })
                    );
                }
            })
            .catch(err => console.error("Error fetching suggested:", err))
            .finally(() => setLoading(false));
    }


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
                    {Array.from({ length: suggestedAnimes.length || 25 }).map((_, i) => (
                        <div key={i} className="skeleton-card"></div>
                    ))}
                </div>
            </div>
        )}

            {!loading && (
                <div className="suggestedanimelist">
                    {suggestedAnimes.map((anime, index) => (
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
                            color="white"
                            _hover={
                                currentPage === pageNum
                                    ? { bg: "blue", color: "white" }
                                    : { bg: "white", color: "black" }
                            }
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
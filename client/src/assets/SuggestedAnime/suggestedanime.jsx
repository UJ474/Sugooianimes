import { useEffect, useState } from "react";
import suggestedanimedata from './suggestedanimedata.jsx';
import AnimeCard from "../components/animecard.jsx";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton.jsx";
import Pagination from "../../components/Pagination.jsx";
import '../css_files/spinner.css';
import './suggestedanime.css';
import { getTopAnime } from "../../services/kitsuService.js";

export default function SuggestedAnime() {
    const [suggestedAnimes, setSuggestedAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const storedData = localStorage.getItem("suggested_page_cache_v3");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (parsed.page === currentPage && now - parsed.timestamp < oneDay && parsed.data?.length > 0) {
                    setSuggestedAnimes(parsed.data || []);
                    setTotalPages(parsed.totalPages || 1);
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

    async function fetchAndStore(page) {
        setLoading(true);
        try {
            const list = await getTopAnime(page, 20);
            if (list && list.length > 0) {
                setSuggestedAnimes(list);
                setTotalPages(list.totalPages || 1);
                suggestedanimedata.length = 0;
                suggestedanimedata.push(...list);

                localStorage.setItem(
                    "suggested_page_cache_v3",
                    JSON.stringify({
                        data: list,
                        totalPages: list.totalPages || 1,
                        timestamp: Date.now(),
                        page: page,
                    })
                );
            } else {
                setSuggestedAnimes([]);
            }
        } catch (err) {
            console.error("Error fetching suggested:", err);
            setSuggestedAnimes([]);
        } finally {
            setLoading(false);
        }
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
                    {Array.from({ length: 20 }).map((_, i) => (
                        <AnimeCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )}

            {!loading && (
                <div className="suggestedanimelist">
                    {suggestedAnimes.map((anime, index) => (
                        <AnimeCard
                            key={anime.mal_id || index}
                            animeId={anime.mal_id}
                            title={anime.title_english || anime.title}
                            imageUrl={anime.imageUrl}
                            synopsis={anime.synopsis}
                            rating={anime.score}
                            status={anime.status || "Finished Airing"}
                            genres={anime.genres}
                            episodes={anime.episodes}
                        />
                    ))}
                </div>
            )}

            {!loading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
    );
}

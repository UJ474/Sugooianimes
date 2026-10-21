import { useEffect, useState } from "react";
import currentanimedata from './currentanimedata.jsx';
import AnimeCard from "../components/animecard.jsx";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton.jsx";
import Pagination from "../../components/Pagination.jsx";
import '../css_files/spinner.css';
import './currentanime.css';
import { getCurrentAnime } from "../../services/kitsuService.js";

export default function CurrentAnimes() {
    const [currentAnimes, setCurrentAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const storedData = localStorage.getItem('current_airing_page_data_v3');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                if (parsedData.page === currentPage && (now - parsedData.timestamp < oneDay) && parsedData.data?.length > 0) {
                    setCurrentAnimes(parsedData.data || []);
                    currentanimedata.length = 0;
                    currentanimedata.push(...(parsedData.data || []));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('Failed to parse cached current airing data:', err);
            }
        }

        fetchAndStoreCurrentAnime(currentPage);
    }, [currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    async function fetchAndStoreCurrentAnime(page) {
        setLoading(true);
        try {
            const list = await getCurrentAnime(page, 20);
            if (list && list.length > 0) {
                setCurrentAnimes(list);
                setTotalPages(list.totalPages || 1);
                currentanimedata.length = 0;
                currentanimedata.push(...list);

                try {
                    localStorage.setItem('current_airing_page_data_v3', JSON.stringify({
                        data: list,
                        totalPages: list.totalPages || 1,
                        timestamp: Date.now(),
                        page: page
                    }));
                } catch (err) {
                    console.warn('Failed to cache current airing page data:', err);
                }
            } else {
                setCurrentAnimes([]);
            }
        } catch (error) {
            console.error("Error fetching current anime:", error);
            setCurrentAnimes([]);
        } finally {
            setLoading(false);
        }
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
                        <AnimeCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )}

        {!loading && (
            <div className="suggested-anime-list">
                {currentAnimes.map((anime, index) => (
                    <AnimeCard
                        key={index}
                        animeId={anime.mal_id}
                        title={anime.title_english || anime.title}
                        imageUrl={anime.imageUrl}
                        synopsis={anime.synopsis}
                        rating={anime.score}
                        status={null}
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

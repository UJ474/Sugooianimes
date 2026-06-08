import React, { useRef, useState, useEffect } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import AnimeCard from './animecard';
import AnimeCardSkeleton from './AnimeCardSkeleton';
import './animerow.css';

const AnimeRow = ({ title, animeList, loading, onShowMore }) => {
    const rowRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setIsScrolled(scrollLeft > 0);
            // Using a small offset (10px) to prevent sub-pixel rounding errors from hiding the arrow
            setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10);
        }
    };

    useEffect(() => {
        handleScroll();
        // Setup resize listener to recalculate bounds when window size changes
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [animeList, loading]);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { clientWidth } = rowRef.current;
            // Scroll by roughly the width of the container minus a card's width for context
            const scrollAmount = direction === 'left' ? -(clientWidth - 200) : (clientWidth - 200);
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            
            // Allow time for smooth scroll to finish, then check position
            setTimeout(handleScroll, 400);
        }
    };

    return (
        <Box mt="3rem" mb="1rem" className="anime-row-container">
            <Flex align="center" justify="space-between" pl="20px" pr="20px" mb="1rem">
                <Text
                    className="fancyheading"
                    fontSize="3xl"
                    fontWeight="800"
                    letterSpacing="wide"
                    bgGradient="linear(50deg, #4924eefb)"
                    bgClip="text"
                >
                    {title}
                </Text>

                {onShowMore && (
                    <Button
                        onClick={onShowMore}
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
                )}
            </Flex>

            <Box position="relative" w="100%">
                {/* Left Arrow */}
                <button
                    className={`anime-row-arrow anime-row-arrow-left ${isScrolled ? 'visible' : ''}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {/* Right Arrow */}
                <button
                    className={`anime-row-arrow anime-row-arrow-right ${!isAtEnd && (!loading && animeList.length > 0) ? 'visible' : ''}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Scrollable Container */}
                <Flex
                    ref={rowRef}
                    className="anime-scroll-row"
                    overflowX="auto"
                    gap="10px"
                    pl="20px"
                    pr="20px"
                    pb="10px"
                    onScroll={handleScroll}
                >
                    {loading ? (
                        // Render Skeletons
                        Array.from({ length: 10 }).map((_, i) => (
                            <Box key={i} flex="0 0 auto">
                                <AnimeCardSkeleton />
                            </Box>
                        ))
                    ) : (
                        // Render Anime Cards
                        animeList.map((anime, index) => (
                            <Box key={index} flex="0 0 auto">
                                <AnimeCard
                                    title={anime.title_english || anime.title}
                                    imageUrl={anime.imageUrl}
                                    synopsis={anime.synopsis ?? "No synopsis available"}
                                    rating={anime.score ?? "N/A"}
                                    status={title === "Currently Airing" ? null : anime.status}
                                    genres={anime.genres}
                                    episodes={anime.episodes}
                                />
                            </Box>
                        ))
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default AnimeRow;

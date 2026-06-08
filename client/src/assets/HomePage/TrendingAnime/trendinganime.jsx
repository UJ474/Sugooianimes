import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import './trendinganime.css';
import '../../css_files/spinner.css';
import GlowButton from '../../../components/GlowButton.jsx';
import Badge from '../../../components/Badge.jsx';

import img1 from './TrendingAssests/frieren.png';
import img2 from './TrendingAssests/fullmetal.png';
import img3 from './TrendingAssests/steinsgate.png';
import img4 from './TrendingAssests/onepiecefanletter.png';
import img5 from './TrendingAssests/attackontitan.png';
import img6 from './TrendingAssests/gintama4.png';
import img7 from './TrendingAssests/gintamafinal.png';
import img8 from './TrendingAssests/hunterxhunter.png';
import img9 from './TrendingAssests/gintama2.png';
import img10 from './TrendingAssests/gintamaen.png';

const STATIC_ANIME_DATA = [
  {
    title: "Frieren: Beyond Journey's End",
    title_japanese: "Sousou no Frieren",
    synopsis: "During their decade-long quest to defeat the Demon King, the members of the hero's party—Himmel himself, the priest Heiter, the dwarf warrior Eisen, and the elven mage Frieren—forge bonds through adventures and battles, creating unforgettable precious memories for most of them.\n\nHowever, the time that Frieren spends with her comrades is equivalent to merely a fraction of her life, which has lasted over a thousand years. When the party disbands after their victory, Frieren casually returns to her \"usual\" routine of collecting spells across the continent.",
    genres: [{ name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
    image: img1,
    id: 52991
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    title_japanese: "Hagane no Renkinjutsushi",
    synopsis: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle banning human transmutation, the boys attempted to bring their recently deceased mother back to life. Instead, they suffered brutal personal loss: Alphonse's body disintegrated while Edward lost a leg and then sacrificed an arm to keep Alphonse's soul in the physical realm by binding it to a hulking suit of armor.",
    genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
    image: img2,
    id: 5114
  },
  {
    title: "Steins;Gate",
    title_japanese: "Steins;Gate",
    synopsis: "Eccentric scientist Rintarou Okabe has a never-ending thirst for scientific exploration. Together with his ditzy but well-meaning friend Mayuri Shiina and his roommate Itaru Hashida, Okabe founds the Future Gadget Laboratory in the hopes of creating technological innovations that baffle the human psyche. Despite claims of grandeur, the only notable \"gadget\" the trio have created is a microwave that has the mystifying power to turn bananas into green goo.",
    genres: [{ name: "Sci-Fi" }, { name: "Suspense" }],
    image: img3,
    id: 9253
  },
  {
    title: "One Piece Fan Letter",
    title_japanese: "One Piece Fan Letter",
    synopsis: "Although the golden age of piracy is about to reach new heights, most people do not seek the glory of finding the elusive One Piece—a treasure signifying a new conqueror of all seas that was once embodied by the legendary King of the Pirates, Gol D. Roger. However, even if civilians generally despise pirates, they secretly cheer for at least one of them. One red-headed girl from Sabaody Archipelago is no exception: She reveres Nami, the ingenious female navigator of Monkey D. Luffy's Straw Hat crew.",
    genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
    image: img4,
    id: 59714
  },
  {
    title: "Attack on Titan",
    title_japanese: "Shingeki no Kyojin",
    synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter.",
    genres: [{ name: "Action" }, { name: "Award Winning" }, { name: "Drama" }, { name: "Suspense" }],
    image: img5,
    id: 16498
  },
  {
    title: "Gintama Season 4",
    title_japanese: "Gintama.",
    synopsis: "After joining the resistance against the bakufu, Gintoki and the gang are in hiding, along with Katsura and his Joui rebels. The Yorozuya is soon approached by Nobunobu Tokugawa, the current shogun, who asks them to help him regain his power from the Tendoshuu. With the help of the Kiheitai, the Yorozuya must now form an alliance with their old enemies, the Shinsengumi, to protect Edo from the Tendoshuu's grasp.",
    genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Sci-Fi" }],
    image: img6,
    id: 34096
  },
  {
    title: "Gintama: The Final",
    title_japanese: "Gintama: The Final",
    synopsis: "Two years have passed following the Tendoshuu's invasion of the O-Edo Central Terminal. Since then, the Yorozuya have gone their separate ways. Foreseeing Utsuro's return, Gintoki Sakata begins surveying Earth's ley lines for traces of the other man's Altana. After an encounter with the remnants of the Tendoshuu—who continue to press on in search of immortality—Gintoki returns to Edo.",
    genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Sci-Fi" }],
    image: img7,
    id: 39486
  },
  {
    title: "Hunter x Hunter (2011)",
    title_japanese: "Hunter x Hunter",
    synopsis: "Hunters devote themselves to accomplishing hazardous tasks, all from traversing the world's uncharted territories to locating rare items and monsters. Before becoming a Hunter, one must pass the Hunter Examination—a high-risk selection process in which most applicants end up handicapped or worse, deceased. What drives 12-year-old Gon Freecss is finding Ging, his father and a Hunter himself.",
    genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
    image: img8,
    id: 11061
  },
  {
    title: "Gintama Season 2",
    title_japanese: "Gintama'",
    synopsis: "After a one-year hiatus, Shinpachi Shimura returns to Edo, only to stumble upon a shocking surprise: Gintoki and Kagura, his fellow Yorozuya members, have become completely different characters! Fleeing from the Yorozuya headquarters in confusion, Shinpachi finds that all the denizens of Edo have undergone impossibly extreme changes, in both appearance and personality.",
    genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Sci-Fi" }],
    image: img9,
    id: 9969
  },
  {
    title: "Gintama: Enchousen",
    title_japanese: "Gintama': Enchousen",
    synopsis: "While Gintoki Sakata was away, the Yorozuya found themselves a new leader: Kintoki, Gintoki's golden-haired doppelganger. In order to regain his former position, Gintoki will need the help of those around him, a troubling feat when no one can remember him! Between Kintoki and Gintoki, who will claim the throne as the main character?",
    genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Sci-Fi" }],
    image: img10,
    id: 15417
  }
];

export default function TrendingAnime() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [autoPlay, setAutoPlay] = useState(true);
    const intervalRef = useRef(null);

    const goToSlide = (index) => {
        setPrevIndex(currentIndex);
        setCurrentIndex(index);
        setAutoPlay(false);
        setTimeout(() => setAutoPlay(true), 6000);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? STATIC_ANIME_DATA.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % STATIC_ANIME_DATA.length;
        goToSlide(newIndex);
    };

    // Auto rotate every 2 seconds
    useEffect(() => {
        if (autoPlay) {
            intervalRef.current = setInterval(() => {
                setPrevIndex(currentIndex);
                setCurrentIndex((prev) => (prev + 1) % STATIC_ANIME_DATA.length);
            }, 5000);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [currentIndex, autoPlay]);

    const currentAnime = STATIC_ANIME_DATA[currentIndex];

    return (
        <div className="trendingheroslider">
            <div className="herosliderimages">
                {prevIndex !== null && (
                    <img
                        src={STATIC_ANIME_DATA[prevIndex].image}
                        alt="Previous Slide"
                        className="slide-image fade-out"
                    />
                )}
                <img
                    src={currentAnime.image}
                    alt="Current Slide"
                    className="slide-image fade-in"
                />
                
                {/* Cinematic Vignette Overlay */}
                <div className="hero-gradient-overlay"></div>
            </div>

            <button 
                className="nav-button nav-button-left"
                onClick={goToPrevious}
                aria-label="Previous anime"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <button 
                className="nav-button nav-button-right"
                onClick={goToNext}
                aria-label="Next anime"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <div className="progress-indicators">
                {STATIC_ANIME_DATA.map((_, index) => (
                    <div
                        key={index}
                        className={`progress-dash ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        role="button"
                        tabIndex={0}
                    />
                ))}
            </div>

            <div className="trendingherosliderdata content-fade-in">
                <div className="hero-content">
                    <h1 className="hero-title">{currentAnime.title_japanese}</h1>
                    <p className="hero-subtitle">{currentAnime.title}</p>
                    
                    <div className="hero-genres">
                        {currentAnime.genres.map((gen) => (
                            <Link
                                to={`/genre/${gen.name.toLowerCase().replace(/\s+/g, '_')}`}
                                key={gen.name}
                                state={{ genreKey: gen.name.toLowerCase().replace(/\s+/g, '_'), genreName: gen.name }}
                                style={{ textDecoration: 'none' }}
                            >
                                <Badge bg="rgba(98, 63, 255, 0.25)" border="1px solid rgba(98, 63, 255, 0.4)" color="#e6dfff" mr={2} mb={2}>{gen.name}</Badge>
                            </Link>
                        ))}
                    </div>
                    
                    <p className="hero-synopsis">
                        {currentAnime.synopsis}
                    </p>
                    
                    <div className="hero-actions">
                        <Link to={`/anime/${currentAnime.id}`} style={{ textDecoration: 'none' }}>
                            <GlowButton variant="solid" size="lg" px={10} leftIcon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            }>
                                Watch Now
                            </GlowButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import CurrentAnimeFeed from './Othercontents/currentanimefeed.jsx'
import SuggestedAnimeFeed from './Othercontents/suggestedanimefeed.jsx'
import TrendingAnime from './TrendingAnime/trendinganime.jsx'
import GenreSection from './Genresuggestion/genresection.jsx'

import RelatedGenreFeed from './Othercontents/relatedgenrefeed.jsx'; 

export default function HomePagecontent() {

    const homepageGenres = [
        { name: "Action", mal_id: 1 },
        { name: "Adventure", mal_id: 2 },
        { name: "Isekai", mal_id: 62 },
        { name: "Romance", mal_id: 22 },
        { name: "Comedy", mal_id: 4 }
    ];

    return (
        <>
            <TrendingAnime />
            <CurrentAnimeFeed />
            <SuggestedAnimeFeed />
            <RelatedGenreFeed genres={homepageGenres} />
            <GenreSection />
        </>
    );
}
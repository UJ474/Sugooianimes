import React from "react";
import { Box, Text, SimpleGrid, Link as ChakraLink, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./genresection.css";


const genreList = [
  { name: "Action", key: "action" },
  { name: "Adventure", key: "adventure" },
  { name: "Cars", key: "cars" },
  { name: "Comedy", key: "comedy" },
  { name: "Dementia", key: "dementia" },
  { name: "Demons", key: "demons" },
  { name: "Drama", key: "drama" },
  { name: "Ecchi", key: "ecchi" },
  { name: "Fantasy", key: "fantasy" },
  { name: "Game", key: "game" },
  { name: "Harem", key: "harem" },
  { name: "Historical", key: "historical" },
  { name: "Horror", key: "horror" },
  { name: "Isekai", key: "isekai" },
  { name: "Josei", key: "josei" },
  { name: "Kids", key: "kids" },
  { name: "Magic", key: "magic" },
  { name: "Martial Arts", key: "martial_arts" },
  { name: "Mecha", key: "mecha" },
  { name: "Military", key: "military" },
  { name: "Music", key: "music" },
  { name: "Mystery", key: "mystery" },
  { name: "Parody", key: "parody" },
  { name: "Police", key: "police" },
  { name: "Psychological", key: "psychological" },
  { name: "Romance", key: "romance" },
  { name: "Samurai", key: "samurai" },
  { name: "School", key: "school" },
  { name: "Sci-Fi", key: "sci_fi" },
  { name: "Seinen", key: "seinen" },
  { name: "Shoujo", key: "shoujo" },
  { name: "Shounen", key: "shounen" },
  { name: "Slice of Life", key: "slice_of_life" },
  { name: "Space", key: "space" },
  { name: "Sports", key: "sports" },
  { name: "Super Power", key: "super_power" },
  { name: "Supernatural", key: "supernatural" },
  { name: "Thriller", key: "thriller" },
  { name: "Vampire", key: "vampire" },
];

export default function GenreSection() {
  return (
    <Box
      className="genresectioncontainer"
      p="8rem"
      bg="linear-gradient(180deg, #0a0a12 0%, #0f0f1a 100%)"
      color="white"
      textAlign="center"
    >
      <Text
        className="genretitle"
        fontSize="5xl"
        fontWeight="800"
        letterSpacing="wide"
        mb="1.5rem"
        color="brand.300"
      >
        Genres
      </Text>

      <SimpleGrid
        className="genregrid"
        columns={[3, 4, 5, 5]}
        minChildWidth="125px"
        spacing="1.8rem"
        bg="transparent"
        p="0"
      >
        {genreList.map((genre, index) => (
          <ChakraLink
            key={index}
            as={Link}
            to={`/genre/${genre.key}`}
            state={{ genreKey: genre.key, genreName: genre.name }}
            className="genrelink"
            backdropFilter="blur(6px)"
            border="1px solid transparent"
            bg="linear-gradient(#1a1a2e, #000000ff) padding-box, linear-gradient(90deg, rgba(255,255,255,0.25), rgba(0,0,0,0)) border-box"
            p="0.8rem"
            minW="180px"
            borderRadius="md"
            boxShadow="0 4px 12px rgba(0,0,0,0.3)"
            transition="all 0.25s ease"
            _hover={{
              transform: "scale(1.12)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              // bg: "rgba(40,40,75,0.9)"
            }}
            textAlign="center"
            fontSize="md"
            fontWeight="600"
            color="brand.100"
          >
            {genre.name}
          </ChakraLink>
        ))}
      </SimpleGrid>

      <Box className="showmorecontainer" mt="2rem">
        <Button
          as={Link}
          to="/filter"
          className="showmorebtn"
          bg="#5982ffff"
          _hover={{ bg: "#4975fbff", color:"black", transform: "scale(1.05)" }}
          fontSize="lg"
          fontWeight="700"
          px="2.5rem"
          py="1rem"
          borderRadius="md"
          boxShadow="0 6px 18px rgba(0,0,0,0.4)"
        >
          Show more
        </Button>
      </Box>
    </Box>
  );
}


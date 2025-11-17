import { Link } from "react-router-dom";
import { Box, Image, Text } from "@chakra-ui/react";

export default function AnimeCard({ title, imageUrl, synopsis, rating }) {
  return (
    <Link to={`/anime/${encodeURIComponent(title)}`}>
      <Box
        // className="anime-card"
        position="relative"
        width="14rem"
        borderRadius="sm"
        overflow="hidden"
        bg="gray.800"
        shadow="md"
        transition="0.25s"
        _hover={{
          transform: "scale(1.05)",
          shadow: "lg",
        }}
        m="10px"
      >
        <Box width="100%" aspectRatio="2 / 3" overflow="hidden">
          <Image
            src={imageUrl}
            alt={title}
            width="100%"
            height="100%"
            objectFit="cover"
            transition="0.3s"
            opacity={1}
          />
        </Box>

        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          opacity="0"
          transition="0.3s"
          bgGradient="linear(to-t, blackAlpha.900, transparent)"
          _hover={{ opacity: 1 }}
          color="white"
          p="10px"
        >
          <Box position="absolute" bottom="10px">
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
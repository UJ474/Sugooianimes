import { Link } from "react-router-dom";
import { Box, Image, Text, Skeleton, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";
import Badge from "../../components/Badge.jsx";
import GlowButton from "../../components/GlowButton.jsx";

export default function AnimeCard({ title, imageUrl, synopsis, rating, status, genres, episodes }) {
  const [loaded, setLoaded] = useState(false);

  // Determine colors based on rating
  let ratingColor = "gray.500";
  let glowColor = "rgba(156, 163, 175, 0.5)"; // Gray glow
  
  if (rating >= 8) {
    ratingColor = "#eab308"; // Gold
    glowColor = "rgba(234, 179, 8, 0.15)";
  } else if (rating >= 6) {
    ratingColor = "#facc15"; // Yellow
    glowColor = "rgba(250, 204, 21, 0.1)";
  } else if (rating > 0) {
    ratingColor = "#ef4444"; // Red
    glowColor = "rgba(239, 68, 68, 0.1)";
  }

  return (
    <Link 
      to={`/anime/${encodeURIComponent(title)}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        position="relative"
        width="14rem"
        borderRadius="12px"
        overflow="hidden"
        bg="#111116"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        className="anime-card-premium"
        _hover={{
          transform: "scale(1.08)",
          boxShadow: `0 8px 20px ${glowColor}, 0 0 10px ${glowColor}`,
          zIndex: 10,
        }}
        m="10px"
        role="group"
      >
        <Box width="100%" aspectRatio="2 / 3" overflow="hidden" position="relative">

          {!loaded && (
            <Skeleton
              width="100%"
              height="100%"
              position="absolute"
              top="0"
              left="0"
              startColor="gray.800"
              endColor="gray.600"
            />
          )}

          <Image
            src={imageUrl}
            alt={title}
            width="100%"
            height="100%"
            objectFit="cover"
            transition="0.3s"
            opacity={loaded ? 1 : 0}
            onLoad={() => setLoaded(true)}  
          />
          
          {/* Status Badge - Top Left */}
          {status && (
            <Box position="absolute" top="8px" left="8px" zIndex={2}>
              <Badge 
                bg={status === "Currently Airing" ? "rgba(239, 68, 68, 0.85)" : "rgba(30, 41, 59, 0.85)"}
                color="white"
                border="1px solid rgba(255,255,255,0.1)"
                fontSize="0.65rem"
              >
                {status}
              </Badge>
            </Box>
          )}

          {/* Rating Badge - Top Right */}
          {rating ? (
            <Box position="absolute" top="8px" right="8px" zIndex={2}>
              <Badge 
                bg="rgba(15, 23, 42, 0.85)" 
                color={ratingColor}
                border={`1px solid ${ratingColor}`}
                display="flex"
                alignItems="center"
                gap="4px"
              >
                ★ {rating}
              </Badge>
            </Box>
          ) : null}

          {/* Hover Overlay */}
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            opacity="0"
            transition="all 0.3s ease"
            bg="linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.8) 50%, rgba(10, 10, 15, 0.4) 100%)"
            _groupHover={{ opacity: 1 }}
            color="white"
            p="12px"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            <Box transform="translateY(20px)" transition="all 0.3s ease" _groupHover={{ transform: "translateY(0)" }}>
              {episodes && (
                <Text fontSize="xs" color="gray.300" mb={1} fontWeight="bold">
                  {episodes} Episodes
                </Text>
              )}
              
              {/* Genre Pills */}
              {genres && genres.length > 0 && (
                <Flex flexWrap="wrap" gap="4px" mb={3}>
                  {genres.slice(0, 3).map((genre, idx) => (
                    <Text 
                      key={idx} 
                      fontSize="0.6rem" 
                      bg="rgba(98, 63, 255, 0.3)" 
                      color="#d4c9ff"
                      px="6px" 
                      py="2px" 
                      borderRadius="md"
                      fontWeight="600"
                    >
                      {genre.name}
                    </Text>
                  ))}
                </Flex>
              )}
              
              <Text 
                fontSize="sm" 
                color="gray.200" 
                noOfLines={3} 
                mb={3}
                lineHeight="1.4"
              >
                {synopsis || "No synopsis available."}
              </Text>
              
              <GlowButton 
                variant="solid" 
                size="sm" 
                width="100%" 
                py={4}
                fontSize="sm"
                bg="#623fff"
              >
                View Details
              </GlowButton>
            </Box>
          </Box>
        </Box>

        {/* Title area (visible by default) */}
        <Box p="12px" bg="#111116">
          <Text 
            fontSize="md" 
            fontWeight="bold"
            color="white"
            noOfLines={1}
          >
            {title}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
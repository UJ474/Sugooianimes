import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Badge,
  Image,
  IconButton,
  useToast,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CloseIcon } from "@chakra-ui/icons";

export default function History() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      // TODO: Replace mock with API call
      setTimeout(() => {
        setHistory([]); // Empty mock
        setLoading(false);
      }, 900);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear entire history?")) return;

    setHistory([]);
    toast({
      title: "History cleared.",
      status: "info",
      duration: 1000,
    });
  };

  const removeFromHistory = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from history",
      status: "info",
      duration: 1000,
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {Array.from({ length: history.length || 10 }).map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <Box py={6} px={2}>
      {/* Filters */}
      <HStack
        justify="space-between"
        flexWrap="wrap"
        gap={4}
        mb={6}
      >
        <HStack spacing={3}>
          {["all", "watching", "completed"].map((key) => (
            <Button
              key={key}
              size="sm"
              variant={filter === key ? "solid" : "outline"}
              colorScheme="purple"
              onClick={() => setFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Button>
          ))}
        </HStack>

        {history.length > 0 && (
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={clearHistory}
          >
            Clear All
          </Button>
        )}
      </HStack>

      {/* Empty state */}
      {history.length === 0 ? (
        <Center py={20} textAlign="center">
          <VStack spacing={4}>
            <Text fontSize="4xl" opacity={0.5}>
              📄
            </Text>
            <Text fontSize="2xl" fontWeight="300">
              No History Found
            </Text>
            <Text fontSize="md" color="gray.400">
              Start watching anime to see it appear here.
            </Text>
            <Button as={Link} to="/" colorScheme="purple">
              Browse Anime
            </Button>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={4}>
          {history.map((item) => (
            <Box
              key={item.id}
              w="full"
              bg="gray.800"
              border="1px solid rgba(255,255,255,0.1)"
              borderRadius="md"
              overflow="hidden"
              _hover={{
                transform: "translateX(4px)",
                transition: "0.2s",
                borderColor: "gray.600",
              }}
              position="relative"
            >
              <Link to={`/anime/${item.anime.title}`}>
                <HStack spacing={0} align="stretch">
                  <Image
                    src={item.anime.image}
                    alt={item.anime.title}
                    w="140px"
                    h="200px"
                    objectFit="cover"
                  />

                  <VStack
                    align="start"
                    spacing={2}
                    p={4}
                    flex={1}
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="600"
                      noOfLines={2}
                    >
                      {item.anime.title}
                    </Text>

                    <HStack spacing={2} fontSize="sm" color="gray.400">
                      <Text>
                        Episode {item.lastEpisode} of{" "}
                        {item.anime.totalEpisodes}
                      </Text>
                      <Text>•</Text>
                      <Text>{item.watchedAt}</Text>
                    </HStack>

                    {/* Progress */}
                    <Box
                      w="full"
                      h="6px"
                      bg="gray.700"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="full"
                        bgGradient="linear(to-r, purple.500, purple.700)"
                        width={`${(item.lastEpisode / item.anime.totalEpisodes) * 100}%`}
                      />
                    </Box>

                    {/* Status */}
                    <Badge
                      colorScheme={
                        item.status === "completed" ? "green" : "blue"
                      }
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {item.status === "completed"
                        ? "Completed"
                        : "Watching"}
                    </Badge>
                  </VStack>
                </HStack>
              </Link>

              {/* Remove Button */}
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                position="absolute"
                top={3}
                right={3}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="0.2s"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromHistory(item.id);
                }}
              />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
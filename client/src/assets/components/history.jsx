import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Image,
  IconButton,
  useToast,
  Center,
  Badge
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CloseIcon } from "@chakra-ui/icons";
import API from "../../api";

export default function History() {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let res;

      if (filter === "all") {
        res = await API.get("/weeb/history");
      } 
      else if (filter === "watching") {
        res = await API.get("/weeb/watching");
      } 
      else if (filter === "completed") {
        res = await API.get("/weeb/completed");
      }

      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading history:", err);
      setHistory([]);
      setLoading(false);
    }
  };

  const removeFromHistory = async (mal_id) => {
    try {
      const res = await API.delete(`/weeb/history/${mal_id}`);
      setHistory(res.data.history || res.data);
    } catch (err) {
      console.error("Error removing:", err);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear entire history?")) return;

    try {
      const res = await API.delete("/weeb/history");

      setHistory(res.data.history || []);

    toast({
      title: "History Removed!",
      status: "error",
      duration: 1200,
      position: "top-right",
      containerStyle: {
        bg: "#7c3aed",
        color: "white",
        fontWeight: "bold",
        borderRadius: "12px",
      }
    });

    } catch (err) {
      console.error("Failed to clear history:", err);
    }
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
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Box py={6} px={2}>
      <HStack justify="space-between" mb={6}>
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

        {history.length > 0 && filter === "all" && (
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

      {history.length === 0 ? (
        <Center py={20}>
          <VStack spacing={3}>
            <Text fontSize="4xl" opacity={0.5}>📄</Text>
            <Text fontSize="2xl" fontWeight="300">
              No History Found
            </Text>
            <Text color="gray.400">
              Start exploring anime and they will appear here.
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
              key={item.mal_id}
              w="full"
              bg="gray.800"
              border="1px solid rgba(255,255,255,0.1)"
              borderRadius="md"
              overflow="hidden"
              position="relative"
              _hover={{ transform: "translateX(4px)", transition: "0.2s" }}
            >
              <Link to={`/anime/${item.title}`}>
                <HStack spacing={0}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    w="140px"
                    h="200px"
                    objectFit="cover"
                  />

                  <VStack align="start" spacing={2} p={4} flex="1">
                    <Text fontSize="lg" fontWeight="600" noOfLines={2}>
                      {item.title}
                    </Text>

                    {filter !== "all" && (
                      <Badge
                        colorScheme={
                          filter === "completed"
                            ? "green"
                            : filter === "watching"
                            ? "blue"
                            : "purple"
                        }
                        borderRadius="full"
                        px={3}
                      >
                        {filter}
                      </Badge>
                    )}

                    <Text fontSize="sm" color="gray.400">
                      Added: {new Date(item.addedAt).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
              </Link>

              {filter === "all" && (
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  position="absolute"
                  top={3}
                  right={3}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromHistory(item.mal_id);
                  }}
                />
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
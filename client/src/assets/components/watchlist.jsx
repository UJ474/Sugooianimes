import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Button,
  IconButton,
  VStack,
  HStack,
  useToast,
  Badge,
  Center,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import '../css_files/watchlist.css'; // kept for backwards compatibility (now minimal)
import API from '../../api';
import monitorplay from '../images/monitor-play.png';


export default function Watchlist() {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!user) return; // if no user we'll show empty UI below
    fetchWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/weeb/watchlist');

      // normalize response to an array
      const payload = Array.isArray(res.data)
        ? res.data
        : (res.data.watchlist || res.data.data || []);

      setWatchlist(payload);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      toast({
        title: 'Failed to load watchlist',
        status: 'error',
        duration: 1200,
        position: 'top-right',
        containerStyle: {
          bg: '#7c3aed',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (mal_id) => {
    try {
      // call server
      await API.delete(`/weeb/watchlist/${mal_id}`);

      // update local UI
      setWatchlist((prev) => prev.filter((a) => a.mal_id !== mal_id));

      toast({
        title: 'Removed from watchlist',
        status: 'error',
        duration: 1200,
        position: 'top-right',
        containerStyle: {
          bg: '#7c3aed',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
        }
      });
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      toast({ title: 'Failed to remove', status: 'error' });
    }
  };

  // skeleton / loading grid
  if (loading) {
    return (
      <div style={{ padding: "2rem", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem"
          }}
        >
          {Array.from({ length: watchlist.length || 10 }).map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  // empty state
  if (!loading && watchlist.length === 0) {
    return (
      <Center minH="60vh" p={{ base: 6, md: 12 }}>
        <VStack spacing={6} textAlign="center">
          <Box
            bgGradient="linear(to-br, brand.400, brand.200)"
            w="120px"
            h="120px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={monitorplay} alt="Empty" width="60px" height="60px" />
          </Box>

          <Heading size="md" color="white">Your watchlist is empty</Heading>
          <Text color="gray.300">Save anime to your watchlist to find them later.</Text>

          <HStack spacing={4}>
            <Button as={RouterLink} to="/current" colorScheme="purple" variant="solid" textShadow="none" _hover={{ textShadow:"none", boxShadow:"none", color:'black'}} _active={{ textShadow:"none", boxShadow:"none" }} _focus={{ textShadow:"none", boxShadow:"none" }}>Browse anime</Button>
            <Button as={RouterLink} to="/filter" variant="outline" borderColor="rgba(255,255,255,0.08)" textShadow="none" _hover={{ textShadow:"none", boxShadow:"none", color:'white' }} _active={{ textShadow:"none", boxShadow:"none" }} _focus={{ textShadow:"none", boxShadow:"none" }}>Explore genres</Button>
          </HStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      <Heading size="lg" color="white" mb={6}>Your Watchlist</Heading>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}>
        {watchlist.map((anime) => (
          <Box
            key={anime.mal_id}
            bg="rgba(255,255,255,0.02)"
            borderRadius="12px"
            overflow="hidden"
            transition="transform 0.18s, box-shadow 0.18s"
            _hover={{ transform: 'translateY(-6px)' }}
          >
            <Box position="relative" h="0" pb="140%" bg="gray.800">
              <Image
                src={anime.imageUrl || anime.image || anime.cover || ''}
                alt={anime.title}
                objectFit="cover"
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                fallbackSrc="https://via.placeholder.com/400x560?text=No+Image"
              />

              <IconButton
                aria-label="remove"
                icon={<DeleteIcon />}
                size="sm"
                position="absolute"
                top={3}
                right={3}
                bg="rgba(0,0,0,0.6)"
                color="white"
                _hover={{ bg: 'red.500', textShadow:"none", boxShadow:"none" }}
                _active={{ textShadow:"none", boxShadow:"none" }}
                _focus={{ textShadow:"none", boxShadow:"none" }}
                textShadow="none"
                onClick={() => removeFromWatchlist(anime.mal_id)}
              />
            </Box>

            <Box p={4}>
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontWeight={600} color="white" noOfLines={2}>{anime.title}</Text>
                  <Text fontSize="sm" color="gray.300">{anime.episodes ? `${anime.episodes} eps` : ''}</Text>
                </Box>
                {anime.score && <Badge colorScheme="purple">{anime.score}</Badge>}
              </HStack>

              <HStack mt={4} spacing={3}>
                <Button as={RouterLink} to={`/anime/${encodeURIComponent(anime.title)}`} size="sm" variant="outline" borderColor="rgba(255,255,255,0.06)" color="white" textShadow="none" _hover={{ textShadow:"none", boxShadow:"none" }} _active={{ textShadow:"none", boxShadow:"none" }} _focus={{ textShadow:"none", boxShadow:"none" }}>View</Button>
                <Button size="sm" onClick={() => removeFromWatchlist(anime.mal_id)} variant="ghost" color="gray.300" textShadow="none" _hover={{ textShadow:"none", boxShadow:"none" }} _active={{ textShadow:"none", boxShadow:"none" }} _focus={{ textShadow:"none", boxShadow:"none" }}>Remove</Button>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
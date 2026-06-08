import { Box, Skeleton } from "@chakra-ui/react";

export default function AnimeCardSkeleton() {
  return (
    <Box
      width="14rem"
      borderRadius="12px"
      overflow="hidden"
      bg="#111116"
      m="10px"
    >
      <Skeleton
        width="100%"
        aspectRatio="2 / 3"
        startColor="gray.800"
        endColor="gray.600"
      />
      <Box p="12px">
        <Skeleton height="20px" width="80%" startColor="gray.800" endColor="gray.600" />
      </Box>
    </Box>
  );
}

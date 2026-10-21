import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';

export default function Pagination({ currentPage, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Calculates pagination array with ellipsis, e.g. [1, '...', 4, 5, 6, '...', 12]
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always include page 1
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    // Always include last page
    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Flex
      justify="center"
      align="center"
      gap="8px"
      my="3.5rem"
      flexWrap="wrap"
      px="1rem"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Prev button */}
      <Button
        size="md"
        variant="outline"
        color="white"
        borderColor="rgba(255, 255, 255, 0.2)"
        bg="rgba(18, 18, 24, 0.8)"
        backdropFilter="blur(8px)"
        _hover={{
          bg: 'rgba(98, 63, 255, 0.2)',
          borderColor: '#623fff',
          boxShadow: '0 0 12px rgba(98, 63, 255, 0.4)',
        }}
        _disabled={{
          opacity: 0.35,
          cursor: 'not-allowed',
          _hover: { bg: 'rgba(18, 18, 24, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' },
        }}
        isDisabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        px="18px"
        borderRadius="10px"
      >
        ← Prev
      </Button>

      {/* Number and ellipsis buttons */}
      {pages.map((p, idx) => {
        if (p === 'ellipsis-start' || p === 'ellipsis-end') {
          return (
            <Text
              key={`${p}-${idx}`}
              color="gray.400"
              fontSize="lg"
              px="6px"
              userSelect="none"
              lineHeight="1"
            >
              •••
            </Text>
          );
        }

        const isCurrent = p === currentPage;

        return (
          <Button
            key={p}
            size="md"
            minW="42px"
            h="42px"
            p="0"
            borderRadius="10px"
            fontSize="sm"
            fontWeight="bold"
            transition="all 0.25s ease"
            bg={isCurrent ? 'linear-gradient(135deg, #623fff 0%, #a855f7 100%)' : 'rgba(18, 18, 24, 0.8)'}
            color="white"
            border="1px solid"
            borderColor={isCurrent ? '#a855f7' : 'rgba(255, 255, 255, 0.15)'}
            boxShadow={isCurrent ? '0 0 16px rgba(168, 85, 247, 0.5), 0 0 4px rgba(98, 63, 255, 0.8)' : 'none'}
            _hover={
              isCurrent
                ? { filter: 'brightness(1.15)' }
                : {
                    bg: 'rgba(98, 63, 255, 0.25)',
                    borderColor: '#623fff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(98, 63, 255, 0.3)',
                  }
            }
            onClick={() => handlePageClick(p)}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </Button>
        );
      })}

      {/* Next button */}
      <Button
        size="md"
        variant="outline"
        color="white"
        borderColor="rgba(255, 255, 255, 0.2)"
        bg="rgba(18, 18, 24, 0.8)"
        backdropFilter="blur(8px)"
        _hover={{
          bg: 'rgba(98, 63, 255, 0.2)',
          borderColor: '#623fff',
          boxShadow: '0 0 12px rgba(98, 63, 255, 0.4)',
        }}
        _disabled={{
          opacity: 0.35,
          cursor: 'not-allowed',
          _hover: { bg: 'rgba(18, 18, 24, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' },
        }}
        isDisabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        px="18px"
        borderRadius="10px"
      >
        Next →
      </Button>
    </Flex>
  );
}

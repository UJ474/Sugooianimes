import React from 'react';
import { Button } from '@chakra-ui/react';

const GlowButton = ({ children, onClick, variant = 'solid', ...props }) => {
  return (
    <Button
      onClick={onClick}
      bg={variant === 'solid' ? '#623fff' : 'transparent'}
      color={variant === 'solid' ? 'white' : '#623fff'}
      border={variant === 'outline' ? '2px solid' : 'none'}
      borderColor={variant === 'outline' ? '#623fff' : 'transparent'}
      position="relative"
      borderRadius="full"
      px={8}
      py={6}
      fontWeight="bold"
      _hover={{
        bg: variant === 'solid' ? '#5631f9' : 'rgba(98, 63, 255, 0.15)',
        boxShadow: variant === 'solid' ? '0 0 15px rgba(98, 63, 255, 0.7)' : '0 0 10px rgba(98, 63, 255, 0.4)',
        transform: 'scale(1.05)',
      }}
      transition="all 0.3s ease"
      {...props}
    >
      {children}
    </Button>
  );
};

export default GlowButton;

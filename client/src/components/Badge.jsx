import React from 'react';
import { Badge as ChakraBadge } from '@chakra-ui/react';

const Badge = ({ children, colorScheme = 'brand', variant = 'subtle', ...props }) => {
  return (
    <ChakraBadge
      colorScheme={colorScheme}
      variant={variant}
      px={3}
      py={1}
      borderRadius="full"
      textTransform="uppercase"
      fontSize="xs"
      fontWeight="800"
      letterSpacing="wider"
      backdropFilter="blur(4px)"
      {...props}
    >
      {children}
    </ChakraBadge>
  );
};

export default Badge;

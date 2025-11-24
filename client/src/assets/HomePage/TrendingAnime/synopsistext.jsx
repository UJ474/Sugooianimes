import { useState } from "react";
import { Text, Box } from "@chakra-ui/react";

export default function SynopsisText({ text, limit = 50 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  return (
    <Box>
      <Text fontSize="sm" color="gray.200" lineHeight="1.6">
        {isExpanded ? text : `${text.slice(0, limit)}...`}
        {text.length > limit && (
          <Text
            as="span"
            ml="6px"
            color="brand.300"
            cursor="pointer"
            fontWeight="600"
            _hover={{ color: "brand.100", textDecoration: "underline" }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </Text>
        )}
      </Text>
    </Box>
  );
}
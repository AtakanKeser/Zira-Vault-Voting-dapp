// frontend/src/components/Footer.tsx

import { Box, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box as="footer" py={4} textAlign="center" borderTop="1px" borderColor="gray.200" mt={8}>
      <Text fontSize="sm">ZiraVault Staj Projesi &copy; 2025</Text>
    </Box>
  );
}
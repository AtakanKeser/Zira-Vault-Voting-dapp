// frontend/src/components/Navbar.tsx

import { Box, Flex, Heading, Spacer, Image, Container } from "@chakra-ui/react";
import { ConnectWallet } from "./ConnectWallet";

export function Navbar() {
  return (
    <Box bg="ziraatRed.500" py={2} boxShadow="md">
      <Container maxW="container.xl">
        <Flex align="center">
          {/* Logo için beyaz arka planlı bir kutu oluşturuyoruz */}
          <Box bg="white" borderRadius="full" p="1" mr={4}>
            <Image 
              src="/logo-ziraat.png" 
              alt="Ziraat Bankası Logo" 
              boxSize="38px" // logonun boyutunu ayarlayın
              objectFit="contain"
            />
          </Box>
          
          {/* Başlığın rengini beyaz yapıyoruz */}
          <Heading as="h1" size="lg" letterSpacing={"tighter"} color="white">
            ZiraatVault dApp
          </Heading>

          <Spacer />

          <Box>
            <ConnectWallet />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
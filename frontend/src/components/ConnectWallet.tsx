// frontend/src/components/ConnectWallet.jsx

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Button, Box, Text } from '@chakra-ui/react';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Box textAlign="right">
        <Text fontSize="sm" fontWeight="bold" color="white">
          {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </Text>
        <Button 
          variant="outline" 
          colorScheme="whiteAlpha" // Beyaz ve yarı şeffaf stil
          borderColor="whiteAlpha.700"
          _hover={{ bg: "whiteAlpha.200" }}
          size="sm" 
          onClick={() => disconnect()}
          mt={1}
        >
          Bağlantıyı Kes
        </Button>
      </Box>
    );
  }

  return (
    <Button 
      bg="white" 
      color="ziraatRed.600" // Arka plan beyaz, yazı kırmızı
      _hover={{ bg: 'gray.100' }}
      onClick={() => connect()}
      fontWeight="bold"
    >
      Cüzdanı Bağla
    </Button>
  );
}
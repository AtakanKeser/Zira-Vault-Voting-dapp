// frontend/src/App.jsx

import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import Dashboard from "./pages/Dashboard.tsx";
import theme from "./theme"; // <-- 1. TEMA DOSYASINI IMPORT ET

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.NODE_ENV === 'development' ? hardhat : sepolia, sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      {/* 2. TEMAYI CHAKRA PROVIDER'A PROP OLARAK VER */}
      <ChakraProvider theme={theme}>
        <Dashboard />
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
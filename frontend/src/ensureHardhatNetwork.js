// src/utils/ensureHardhatNetwork.js
export async function ensureHardhatNetwork() {
    const HARDHAT_CHAIN_ID = "0x7a69";              // 31337
    const HARDHAT_RPC      = "http://127.0.0.1:8545";
  
    if (!window.ethereum) return;
  
    const current = await window.ethereum.request({ method: "eth_chainId" });
    if (current === HARDHAT_CHAIN_ID) return;
  
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: HARDHAT_CHAIN_ID,
            chainName: "Hardhat 31337",
            rpcUrls: [HARDHAT_RPC],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          }],
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: HARDHAT_CHAIN_ID }],
        });
      } else {
        throw err;      // kullanıcı reddettiyse vs.
      }
    }
  }
  
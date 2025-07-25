// window.ethereum tipi
interface EthereumProvider {
    isMetaMask?: boolean;
    request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  }
  
  interface Window {
    ethereum?: EthereumProvider;
  }
  
  export {};

  declare module "@/typechain-types" {
    export * from "../../typechain-types";           //   ../../ = proje kökü
  }
  
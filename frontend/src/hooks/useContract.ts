// frontend/src/hooks/useContract.ts

import { useState, useEffect } from "react";
import { type Address, usePublicClient, useWalletClient } from "wagmi";
import { Contract, BrowserProvider, JsonRpcProvider, type Signer } from "ethers";

/**
 * Bu, projenin son ve en stabil useContract hook'udur.
 * useState ve useEffect kullanarak cüzdan bağlantısındaki
 * asenkron durumları ve güncellemeleri doğru bir şekilde yönetir.
 */
export function useContract<T = Contract>({
  address,
  abi,
}: {
  address: Address;
  abi: any;
}) {
  const [contract, setContract] = useState<T | null>(null);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!address || !abi) {
      setContract(null);
      return;
    }

    // Cüzdan bağlıysa (imzalı işlemler için)
    if (walletClient) {
      const provider = new BrowserProvider(walletClient.transport);
      provider.getSigner().then(signer => {
        setContract(new Contract(address, abi, signer) as T);
      });
    }
    // Cüzdan bağlı değilse (salt okunur işlemler için)
    else if (publicClient) {
      const provider = new JsonRpcProvider(publicClient.transport.url);
      setContract(new Contract(address, abi, provider) as T);
    } else {
      setContract(null);
    }
  }, [address, abi, publicClient, walletClient]);

  return contract;
}
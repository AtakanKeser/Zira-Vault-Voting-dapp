import { TransactionResponse } from "ethers";
import { useToast } from "@chakra-ui/react";

export function useTxToast() {
  const toast = useToast();
  return async (txPromise: Promise<TransactionResponse>) => {
    const id = toast({
      title: "İşlem gönderiliyor…",
      status: "loading",
      duration: null,
      isClosable: false,
    });
    const receipt = await (await txPromise).wait();
    toast.update(id, {
      title: "Onaylandı ✅",
      status: "success",
      duration: 5000,
    });
    return receipt;
  };
}

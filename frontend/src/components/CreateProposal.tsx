// frontend/src/components/CreateProposal.tsx

import { useState } from "react";
import { Button, Textarea, VStack, Heading } from "@chakra-ui/react";
import { useContract } from "../hooks/useContract";
import { useTxToast } from "../hooks/useTxToast";
import { CONTRACTS } from "../constants/addresses";
import { ZiraGovernance__factory } from "../typechain-types";
import type { ZiraGovernance } from "../typechain-types";

interface CreateProposalProps {
  onProposalCreated: () => void;
}

export function CreateProposal({ onProposalCreated }: CreateProposalProps) {
  const [description, setDescription] = useState("");
  const toastTx = useTxToast(); // Basit hook'u çağır

  const governance = useContract<ZiraGovernance>({
    address: CONTRACTS.ZIRA_GOVERNANCE,
    abi: ZiraGovernance__factory.abi,
  });

  const handleSubmit = async () => {
    if (!governance || !description) return;
    
    try {
      // Sadece işlem promise'ini hook'a gönderiyoruz.
      // Bildirimlerin tümünü (loading, success, error) hook yönetecek.
      await toastTx(governance.createProposal(description));
      
      // İşlem başarılı olursa bu satırlar çalışır
      setDescription("");
      onProposalCreated(); 
      
    } catch (error) {
      // Hata bildirimi zaten hook tarafından gösterildi.
      // Konsola yazdırmak yine de iyi bir pratik.
      console.error("Proposal creation failed on the component side:", error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md">Yeni Öneri Oluştur</Heading>
      <Textarea
        placeholder="Önerinizi buraya yazın..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={!description || !governance}
      >
        Öneriyi Gönder
      </Button>
    </VStack>
  );
}
// frontend/src/components/ProposalList.tsx

import { useEffect, useState, useCallback } from "react";
import {
  Button, Badge, Card, VStack, SimpleGrid, Heading,
  Text, Progress, Box, Spinner, HStack, Spacer
} from "@chakra-ui/react";
import { ZiraGovernance__factory } from "../typechain-types";
import type { ZiraGovernance } from "../typechain-types";
import { CONTRACTS } from "../constants/addresses";
import { useContract } from "../hooks/useContract";
import { useTxToast } from "../hooks/useTxToast";
import { useAccount } from "wagmi";
import { formatEther } from "ethers";

// Tipleri dışarıdan alacağımız için burada tekrar tanımlamaya gerek yok
type GovInstance = ZiraGovernance;
type Proposal = Awaited<ReturnType<GovInstance["getProposal"]>>;

// Bileşen artık props alıyor
interface ProposalListProps {
  proposals: Proposal[];
  isLoading: boolean;
  refreshProposals: () => void;
}

export default function ProposalList({ proposals, isLoading, refreshProposals }: ProposalListProps) {
  const [votedStatus, setVotedStatus] = useState<Record<string, boolean>>({});
  const { address, isConnected } = useAccount();
  const toastTx = useTxToast(); // Basit hook'u çağır

  const gov = useContract<GovInstance>({
    address: CONTRACTS.ZIRA_GOVERNANCE,
    abi: ZiraGovernance__factory.abi,
  });

  // Oy durumlarını kontrol eden mantık
  useEffect(() => {
    const checkVotedStatus = async () => {
      if (!gov || !address || proposals.length === 0) return;

      const voteChecks = proposals.map(p => gov.hasVoted(p.id, address));
      const results = await Promise.all(voteChecks);
      const newVotedStatus: Record<string, boolean> = {};
      results.forEach((voted, index) => {
        // proposals listesi en yeniden eskiye sıralandığı için doğru ID'yi almalıyız
        newVotedStatus[proposals[index].id.toString()] = voted;
      });
      setVotedStatus(newVotedStatus);
    };
    if (proposals.length > 0) {
      checkVotedStatus();
    }
  }, [gov, address, proposals]);
  
  const vote = async (id: bigint, support: boolean) => {
    if (!gov) return;
    try {
      // Sadece işlem promise'ini hook'a gönderiyoruz.
      await toastTx(gov.vote(id, support));
      refreshProposals(); // Başarılı olursa listeyi yenile
    } catch (error) {
      console.error("Vote failed on the component side:", error);
    }
  };

  const finalize = async (id: bigint) => {
    if (!gov) return;
    try {
      await toastTx(gov.finalizeProposal(id));
      refreshProposals();
    } catch (error) {
      console.error("Finalize failed on the component side:", error)
    }
  };
  
  const stateLabel = (s: number) => ["AKTİF", "KABUL EDİLDİ", "REDDEDİLDİ"][s] ?? "BİLİNMİYOR";

  if (!isConnected) {
    return <Text>Önerileri görmek için lütfen cüzdanınızı bağlayın.</Text>;
  }
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Öneriler</Heading>
      {proposals.length === 0 && <Text>Henüz bir öneri oluşturulmadı.</Text>}
      <SimpleGrid columns={[1, null, 2]} spacing={4}>
        {proposals.map((p) => {
          const proposalIdStr = p.id.toString();
          const state = Number(p.state);
          const deadline = Number(p.deadline) * 1000;
          const hasVoted = votedStatus[proposalIdStr];
          const canFinalize = state === 0 && Date.now() > deadline;
          const yesVotes = parseFloat(formatEther(p.yesVotes));
          const noVotes = parseFloat(formatEther(p.noVotes));
          const totalVotes = yesVotes + noVotes;
          const yesPercent = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

          return (
            <Card key={proposalIdStr} p={4} variant="outline">
              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Text fontWeight="bold" noOfLines={2}>{p.description}</Text>
                  <Spacer />
                  <Badge colorScheme={state === 0 ? "yellow" : state === 1 ? "green" : "red"}>
                    {stateLabel(state)}
                  </Badge>
                </HStack>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Bitiş: {new Date(deadline).toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    Sunan: {p.proposer}
                  </Text>
                </Box>
                <Box>
                  <HStack>
                    <Text fontSize="sm" fontWeight="bold">Evet: {yesVotes.toFixed(2)}</Text>
                    <Spacer />
                    <Text fontSize="sm" fontWeight="bold">Hayır: {noVotes.toFixed(2)}</Text>
                  </HStack>
                  <Progress value={yesPercent} size="sm" colorScheme="green" mt={1} />
                </Box>
                {state === 0 && !canFinalize && (
                  <HStack>
                    <Button onClick={() => vote(p.id, true)} flex={1} colorScheme="green" isDisabled={hasVoted}>Evet</Button>
                    <Button onClick={() => vote(p.id, false)} flex={1} colorScheme="red" isDisabled={hasVoted}>Hayır</Button>
                  </HStack>
                )}
                {canFinalize && (
                  <Button onClick={() => finalize(p.id)} colorScheme="purple">
                    Öneriyi Sonuçlandır
                  </Button>
                )}
                {hasVoted && state === 0 && <Text fontSize="xs" color="gray.500" textAlign="center">Bu öneri için oy kullandınız.</Text>}
              </VStack>
            </Card>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}
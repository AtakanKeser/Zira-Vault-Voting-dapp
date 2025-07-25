// frontend/src/pages/Dashboard.tsx

import { useState, useEffect, useCallback } from "react";
import StakePanel from "../components/StakePanel";
import ProposalList from "../components/ProposalList";
import { CreateProposal } from "../components/CreateProposal";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Grid, GridItem, Heading, Box, VStack, Divider, Container } from "@chakra-ui/react";
import { useContract } from "../hooks/useContract";
import { CONTRACTS } from "../constants/addresses";
import { ZiraGovernance__factory } from "../typechain-types";
import type { ZiraGovernance } from "../typechain-types";
import { useAccount } from "wagmi";

// Tipleri Dashboard seviyesinde tanımlıyoruz
type GovInstance = ZiraGovernance;
type Proposal = Awaited<ReturnType<GovInstance["getProposal"]>>;

export default function Dashboard() {
  // State'i ve veri çekme mantığını buraya taşıdık
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  const governance = useContract<GovInstance>({
    address: CONTRACTS.ZIRA_GOVERNANCE,
    abi: ZiraGovernance__factory.abi,
  });

  const fetchProposals = useCallback(async () => {
    if (!governance) return;
    setIsLoading(true);
    try {
      const total = Number(await governance.proposalCount());
      const fetchedProposals: Proposal[] = [];
      for (let i = 1; i <= total; i++) {
        fetchedProposals.push(await governance.getProposal(BigInt(i)));
      }
      setProposals(fetchedProposals.reverse());
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setIsLoading(false);
    }
  }, [governance]);

  useEffect(() => {
    if (isConnected && governance) {
      fetchProposals();
    }
  }, [isConnected, governance, fetchProposals]);

  return (
    <Box bg="gray.50" minH="100vh"> {/* Arka planı hafif gri yaptık */}
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={8}>
          <GridItem>
            <VStack spacing={8} align="stretch">
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
                <Heading size="lg" mb={4} color="ziraatRed.600"> {/* <-- RENK EKLENDİ */}
                  Stake
                </Heading>
                <StakePanel />
              </Box>
              <Divider />
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
                <CreateProposal onProposalCreated={fetchProposals} />
              </Box>
            </VStack>
          </GridItem>
          <GridItem>
            <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
              <ProposalList proposals={proposals} isLoading={isLoading} refreshProposals={fetchProposals} />
            </Box>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}
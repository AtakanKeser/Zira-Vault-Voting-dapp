// frontend/src/components/StakePanel.tsx

import { parseEther, formatEther } from "ethers";
import { useState, useEffect, useCallback } from "react";
import {
  Button, Input, HStack, Text, VStack,
  Stat, StatLabel, StatNumber, Spinner, StatHelpText
} from "@chakra-ui/react";
import type { ZiraToken, ZiraVault } from "../typechain-types";
import { ZiraVault__factory, ZiraToken__factory } from "../typechain-types";
import { CONTRACTS } from "../constants/addresses";
import { useContract } from "../hooks/useContract";
import { useTxToast } from "../hooks/useTxToast";
import { useAccount } from "wagmi";

export default function StakePanel() {
  const [amount, setAmount] = useState("");
  const [myStake, setMyStake] = useState("0.0");
  const [ziraBalance, setZiraBalance] = useState("0.0");
  const [tvl, setTvl] = useState("0.0");
  const [isLoading, setIsLoading] = useState(true);

  const toastTx = useTxToast();
  const { address, isConnected } = useAccount();

  const token = useContract<ZiraToken>({
    address: CONTRACTS.ZIRA_TOKEN,
    abi: ZiraToken__factory.abi,
  });

  const vault = useContract<ZiraVault>({
    address: CONTRACTS.ZIRA_VAULT,
    abi: ZiraVault__factory.abi,
  });

  const fetchData = useCallback(async () => {
    if (!vault || !token || !address) return;
    setIsLoading(true);
    try {
      const [stake, totalStaked, balance] = await Promise.all([
        vault.balances(address),
        token.balanceOf(CONTRACTS.ZIRA_VAULT),
        token.balanceOf(address)
      ]);
      setMyStake(formatEther(stake));
      setTvl(formatEther(totalStaked));
      setZiraBalance(formatEther(balance));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [vault, token, address]);

  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected, fetchData]);

  const deposit = async () => {
    if (!vault || !token || !address || !amount) return;
    const value = parseEther(amount);
    
    // The async function is now wrapped in parentheses and called immediately `()`
    // which makes it return a promise, fixing the error.
    await toastTx((async () => {
        const allowance = await token.allowance(address, CONTRACTS.ZIRA_VAULT);
        if (allowance < value) {
            const approveTx = await token.approve(CONTRACTS.ZIRA_VAULT, value);
            await approveTx.wait(); // Wait for approval to be mined
        }
        return vault.deposit(value);
    })()); // <-- The change is here

    setAmount("");
    await fetchData();
  };

  const withdraw = async () => {
    if (!vault || !address || !amount) return;
    const value = parseEther(amount);
    await toastTx(vault.withdraw(address, value));
    setAmount("");
    await fetchData();
  };

  const isDepositDisabled = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(ziraBalance);

  if (!isConnected) {
    return <Text>Lütfen cüzdanınızı bağlayın.</Text>;
  }
  if (isLoading) {
    return <Spinner />;
  }

  // Fonksiyonun sonunda JSX döndüren return ifadesi
  return (
    <VStack spacing={4} align="stretch">
      <Stat>
        <StatLabel>Kasadaki Toplam ZIRA (TVL)</StatLabel>
        <StatNumber>{parseFloat(tvl).toFixed(2)}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Mevcut Stake Miktarınız</StatLabel>
        <StatNumber>{parseFloat(myStake).toFixed(2)} ZIRA</StatNumber>
        <StatHelpText>Cüzdan Bakiyeniz: {parseFloat(ziraBalance).toFixed(2)} ZIRA</StatHelpText>
      </Stat>
      <HStack>
        <Input
          placeholder="Miktar (ZIRA)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
        <Button onClick={deposit} colorScheme="green" isDisabled={isDepositDisabled}>
          Deposit
        </Button>
        <Button onClick={withdraw} colorScheme="red" isDisabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(myStake)}>
          Withdraw
        </Button>
      </HStack>
    </VStack>
  );
}
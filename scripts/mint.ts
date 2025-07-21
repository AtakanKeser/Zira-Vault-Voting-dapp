// scripts/mint.ts
import { ethers } from "hardhat";
import deployedAddresses from "../deployedAddresses.json";

async function main() {
  const TOKEN_ADDRESS = deployedAddresses.token;

  // KENDİ METAMASK ADRESİNİZİ BURAYA YAPIŞTIRIN
  const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const amount = ethers.parseEther("1000"); // Hesaba 1000 ZIRA gönder

  console.log(`Getting the ZiraToken contract at address: ${TOKEN_ADDRESS}`);
  const ziraToken = await ethers.getContractAt("ZiraToken", TOKEN_ADDRESS);

  console.log(`Minting ${ethers.formatEther(amount)} ZIRA to ${recipientAddress}...`);
  const tx = await ziraToken.mint(recipientAddress, amount);
  await tx.wait();

  console.log("✅ Minting successful! Tx hash:", tx.hash);

  const balance = await ziraToken.balanceOf(recipientAddress);
  console.log(`New balance of ${recipientAddress}: ${ethers.formatEther(balance)} ZIRA`);
}

main().catch(console.error);
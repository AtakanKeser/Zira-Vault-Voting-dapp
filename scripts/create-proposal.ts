import { ethers } from "hardhat";

async function main() {
  const GOVERNANCE_ADDRESS = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"; // Terminal logunuzdaki adres
  const governance = await ethers.getContractAt("ZiraGovernance", GOVERNANCE_ADDRESS);

  const tx = await governance.createProposal("Bu ilk testimizdir, oylayalim.");
  await tx.wait();

  console.log("✅ Proposal created! Tx hash:", tx.hash);
}

main().catch(console.error);
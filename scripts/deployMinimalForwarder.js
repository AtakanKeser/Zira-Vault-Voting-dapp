const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying MinimalForwarder with account:", deployer.address);

  const Forwarder = await ethers.getContractFactory("MinimalForwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.waitForDeployment();

  console.log("📦 MinimalForwarder deployed at:", forwarder.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

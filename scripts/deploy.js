// scripts/deploy.js
const hre  = require("hardhat");
const { ethers } = hre;
const fs   = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deployer:", deployer.address);

  /* 1) ZiraToken ---------------------------------------------------- */
  const ziraToken = await ethers.deployContract("ZiraToken");
  await ziraToken.waitForDeployment();
  const ziraTokenAddr = await ziraToken.getAddress();
  console.log("📦 ZiraToken :", ziraTokenAddr);

  /* 2) MetaWallet (parametresiz) ------------------------------------ */
  const metaWallet = await ethers.deployContract("MetaWallet");
  await metaWallet.waitForDeployment();
  const metaWalletAddr = await metaWallet.getAddress();
  console.log("📦 MetaWallet:", metaWalletAddr);

  /* 3) ZiraVault(token, metaWallet) --------------------------------- */
  const ziraVault = await ethers.deployContract("ZiraVault", [
    ziraTokenAddr,
    metaWalletAddr,
  ]);
  await ziraVault.waitForDeployment();
  const ziraVaultAddr = await ziraVault.getAddress();
  console.log("📦 ZiraVault :", ziraVaultAddr);

  /* 4) İstersen Vault owner’ını MetaWallet’e devret ----------------- */
  // await (await ziraVault.transferOwnership(metaWalletAddr)).wait();
  // console.log("✅ Vault owner → MetaWallet");

  /* 5) Adresleri front-end’e yaz ------------------------------------ */
  const addresses = {
    ziraToken:  ziraTokenAddr,
    ziraVault:  ziraVaultAddr,
    metaWallet: metaWalletAddr,
  };

  const filePath = path.join(
    __dirname,
    "../frontend/src/contracts/deployedAddresses.json"
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

  console.log("📝  Adresler kaydedildi →", filePath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

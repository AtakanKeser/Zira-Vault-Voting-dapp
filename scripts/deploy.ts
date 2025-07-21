// scripts/deploy.ts
import { ethers, network, run } from "hardhat";
import fs from "fs";

async function main() {
  /* ─────────────────────────────
   * 1) Hesap · ağ bilgisi
   * ───────────────────────────*/
  const [deployer] = await ethers.getSigners();
  console.log(`🚀  Deploying with ${deployer.address} on ${network.name}`);

  /* ─────────────────────────────
   * 2) Sözleşmeleri deploy et
   * ───────────────────────────*/
  const token      = await ethers.deployContract("ZiraToken");
  const forwarder  = await ethers.deployContract("MinimalForwarder");
  const vault      = await ethers.deployContract("ZiraVault", [
    await token.getAddress(),
    await forwarder.getAddress(),
  ]);
  const governance = await ethers.deployContract("ZiraGovernance", [
    await vault.getAddress(),
  ]);

  await Promise.all([
    token.waitForDeployment(),
    forwarder.waitForDeployment(),
    vault.waitForDeployment(),
    governance.waitForDeployment(),
  ]);

  /* ─────────────────────────────
   * 3) Adresleri JSON’a yaz
   * ───────────────────────────*/
  const addrs = {
    network:    network.name,
    token:      await token.getAddress(),
    forwarder:  await forwarder.getAddress(),
    vault:      await vault.getAddress(),
    governance: await governance.getAddress(),
  };
  fs.writeFileSync(
    "deployedAddresses.json",
    JSON.stringify(addrs, null, 2)
  );
  console.log("✅  Deploy tamam:", addrs);

  /* ─────────────────────────────
   * 4) (Ops.) Etherscan verify
   * ───────────────────────────*/
  if (network.name === "sepolia" && process.env.ETHERSCAN_KEY) {
    console.log("🔍  Etherscan verify başlatılıyor…");
    await run("verify:verify", {
      address: addrs.token,
      constructorArguments: [],
    });
    await run("verify:verify", {
      address: addrs.forwarder,
      constructorArguments: [],
    });
    await run("verify:verify", {
      address: addrs.vault,
      constructorArguments: [addrs.token, addrs.forwarder],
    });
    await run("verify:verify", {
      address: addrs.governance,
      constructorArguments: [addrs.vault],
    });
  }

  // 3) (opsiyonel) otomatik Etherscan verify
    if (network.name === "sepolia" && process.env.ETHERSCAN_KEY) {
        await new Promise(r => setTimeout(r, 30_000));
    await run("verify:verify", { address: addrs.token });
    await run("verify:verify", { address: addrs.forwarder });
    await run("verify:verify", {
      address: addrs.vault,
      constructorArguments: [addrs.token, addrs.forwarder],
    });
    await run("verify:verify", {
      address: addrs.governance,
      constructorArguments: [addrs.vault],
    });
  }
  
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

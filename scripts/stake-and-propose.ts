import { ethers } from "hardhat";
// Otomatik oluşturulan adres dosyasını içe aktar
import deployedAddresses from "../deployedAddresses.json";

async function main() {
  // 1. Adresleri `deployedAddresses.json` dosyasından otomatik olarak al
  const TOKEN_ADDRESS = ethers.getAddress(deployedAddresses.token);
  const VAULT_ADDRESS = ethers.getAddress(deployedAddresses.vault);
  const GOVERNANCE_ADDRESS = ethers.getAddress(deployedAddresses.governance);

  // 2. İşlemleri yapacak olan hesabı al
  const [proposer] = await ethers.getSigners();
  console.log(`İşlemler bu hesapla yapılıyor: ${proposer.address}`);

  // 3. Kontratları script'e tanıt
  const ziraToken = await ethers.getContractAt("ZiraToken", TOKEN_ADDRESS, proposer);
  const ziraVault = await ethers.getContractAt("ZiraVault", VAULT_ADDRESS, proposer);
  const ziraGovernance = await ethers.getContractAt("ZiraGovernance", GOVERNANCE_ADDRESS, proposer);

  const stakeAmount = ethers.parseEther("100");

  // --- Adım 4: ZIRA token mint et ---
  console.log(`1. Adım: ${proposer.address} adresine 100 ZIRA mint ediliyor...`);
  await (await ziraToken.mint(proposer.address, stakeAmount)).wait();
  console.log("Mint etme başarılı.");

  // --- Adım 5: ZiraVault'a harcama izni ver ---
  console.log("2. Adım: ZiraVault'a harcama izni veriliyor...");
  await (await ziraToken.approve(VAULT_ADDRESS, stakeAmount)).wait();
  console.log("İzin verme başarılı.");

  // --- Adım 6: ZIRA token'larını stake et ---
  console.log("3. Adım: 100 ZIRA stake ediliyor...");
  await (await ziraVault.deposit(stakeAmount)).wait();
  console.log("Stake etme başarılı.");

  // --- Adım 7: Öneriyi oluştur ---
  console.log("4. Adım: Öneri oluşturuluyor...");
  const tx = await ziraGovernance.createProposal("Bu otomatik script ile oluşturulan test önerisidir.");
  await tx.wait();

  console.log("✅ Öneri başarıyla oluşturuldu! Tx hash:", tx.hash);
}

// Script'i çalıştır ve hataları yakala
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
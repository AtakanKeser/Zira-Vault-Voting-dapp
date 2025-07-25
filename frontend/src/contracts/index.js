import { ethers }         from "ethers";
import deployed           from "./deployedAddresses.json";
import { ZiraTokenABI }   from "../abis/ZiraTokenABI";
import { ZiraVaultABI }   from "../abis/ZiraVaultABI";
import { MetaWalletABI }  from "../abis/MetaWalletABI";

export function getContracts (signerOrProvider) {
  const ziraToken  = new ethers.Contract(deployed.ziraToken,  ZiraTokenABI, signerOrProvider);
  const ziraVault  = new ethers.Contract(deployed.ziraVault,  ZiraVaultABI, signerOrProvider);
  const metaWallet = new ethers.Contract(deployed.metaWallet, MetaWalletABI, signerOrProvider);
  return { ziraToken, ziraVault, metaWallet };
}

// zira-vault/hardhat.config.js

require("dotenv").config();
require("ts-node/register/transpile-only");
require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat");

module.exports = {
  solidity: "0.8.20",

  // BU BÖLÜMÜ EKLEYİN
  paths: {
    sources: "./contracts", // Sadece bu klasördeki .sol dosyalarını derle
  },

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },

  typechain: {
    outDir: "frontend/src/typechain-types",
    target: "ethers-v6",
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
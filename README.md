# ZiraVault - A Token Stake-Based Voting dApp

![ZiraVault Demo](https://i.imgur.com/a95b9c.png) 
This project is a decentralized voting application (dApp) where users gain voting rights on various proposals by staking (locking) `$ZIRA` tokens in a vault. The project was developed using Solidity, Hardhat, Ethers.js, React, and Vite.



---

## Core Features

- **Stake-Weighted Voting:** Users' voting power is directly proportional to the amount of tokens they have staked.
- **Proposal Creation and Voting:** Users with a stake can create new proposals and vote on active ones.
- **Decentralized and Transparent:** All voting logic and rules are managed by immutable smart contracts.
- **MetaMask Integration:** Wallet connection for a modern Web3 experience, built with Wagmi and Ethers.js.
- **Real-Time Interface:** A user interface built with Chakra UI that reacts instantly to data changes.

---

## Tech Stack

- **Blockchain & Smart Contracts:**
  - Solidity
  - Hardhat (Development Environment)
  - OpenZeppelin (Secure Contract Library)
  - Ethers.js (Blockchain Interaction Library)

- **Frontend:**
  - React.js (with Vite)
  - TypeScript
  - Wagmi (React Hooks for Ethereum)
  - Chakra UI (UI Component Library)

- **Test Network:**
  - Sepolia Testnet

---

## Running Locally

Follow these steps to run the project on your local machine.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/AtakanKeser/zira-vault-voting-dapp.git](https://github.com/AtakanKeser/zira-vault-voting-dapp.git)
    cd zira-vault-voting-dapp
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    cd frontend
    npm install
    cd ..
    ```

3.  **Start the Local Blockchain** (in Terminal 1):
    ```bash
    npx hardhat node
    ```

4.  **Deploy the Contracts** (in Terminal 2):
    ```bash
    npx hardhat run scripts/deploy.ts --network localhost
    ```

5.  **Start the Frontend Application** (in Terminal 3):
    ```bash
    cd frontend
    npm start
    ```
    The application will open at `http://localhost:5173`.

---


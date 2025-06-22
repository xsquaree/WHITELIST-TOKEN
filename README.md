# WhitelistToken (WLT) Project

A custom ERC20 token with whitelist-based transfer restrictions and EIP-2612 `permit()` support for gasless approvals.

---

## Features

- Whitelist-based transfers
  Only approved (whitelisted) addresses can send or receive tokens.
  
- Owner-controlled whitelist
  The contract owner can add or remove addresses from the whitelist at any time.

- EIP-2612 `permit()`  
  Supports off-chain signed approvals (gasless approval of allowances).

- OpenZeppelin audited base
  Built on `ERC20`, `ERC20Permit`, and `Ownable` from OpenZeppelin Contracts.

---

## 📜 Deployed Contract

- **Address:** `0xYourDeployedContractAddressHere`
- **Testnet:** `Goerli` (or `Sepolia`, update as appropriate)

> ✉️ _Replace `0xYourDeployedContractAddressHere` with your actual deployed contract address._  

---

## How to Deploy

1) Compile the contract

npx hardhat compile

2) configure your network in WHITELIST_TOKEN/.ENV

Example: 

networks: {
  sepolia: {
    url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    accounts: ["0xYOUR_PRIVATE_KEY"]
  }
}


3) Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia


3) Run the project
npx hardhat run scripts/deploy.js --network sepolia

4) Test the project
npx hardhat test



## Build with
Solidity ^0.8.24
OpenZeppelin Contracts
Hardhat
Ethers v6

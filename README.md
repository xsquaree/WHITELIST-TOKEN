# WhitelistToken Project

A ERC20 token with whitelist-based transfer restrictions and EIP-2612 permit() support for gasless approvals.

---

## Features


- Whitelist Enforcement: Only whitelisted addresses can send or receive tokens.
- Gasless Approvals: Implements EIP-2612 permit() for off-chain signature-based approvals.
- Owner-Controlled Whitelisting: The contract owner can add or remove addresses from the whitelist.
- Initial Minting: Mints 1,000,000 WLT to the initial owner during deployment.
- Built with OpenZeppelin's ERC20, ERC20Permit, and Ownable contracts.

- transfer() and transferFrom() are restricted to whitelisted users.
- addToWhitelist() / removeFromWhitelist() allow dynamic access control.
- permit() enables gasless approvals using signed messages.

---

## Deployed Contract

- Network: Sepolia Testnet
- Deployer Address: 0x554E0b841b57DAAd1c965e397448186F0d23E6e7
- Contract Address: 0xF6f50A0d486312be8062F3Bf9F0Ca834e3045fcD

https://sepolia.etherscan.io/address/0xF6f50A0d486312be8062F3Bf9F0Ca834e3045fcD#code

---


## Prerequisites
- Node.js v18+
- Hardhat
- A Sepolia RPC provider
- Etherscan API key (for verification)

---

## How to Deploy

1) Compile the contract

- npx hardhat compile

2) configure your network in WHITELIST-TOKEN-main/.ENV

- Create a file called .ENV

- Example of the content inside: 

    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
    
    PRIVATE_KEY=your_private_key_with_test_eth
    
    ETHERSCAN_API_KEY=your_etherscan_api_key

3) Compile the project

- npx hardhat compile


3) Deploy the project
- npx hardhat run scripts/deploy.js --network sepolia

4) Test the project
- npx hardhat test

5) Verify project

- npx hardhat verify --network sepolia 0xF6f50A0d486312be8062F3Bf9F0Ca834e3045fcD "0xYourDeployerAddress"

---

## Build with
- Solidity ^0.8.24
- OpenZeppelin Contracts
- Hardhat
- Ethers v6

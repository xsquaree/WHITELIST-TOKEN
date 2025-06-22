const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);

  const TokenFactory = await ethers.getContractFactory("WhitelistToken");

  // 🛠️ Pass deployer.address to the constructor if needed
  const token = await TokenFactory.deploy(deployer.address); 

  await token.waitForDeployment(); // ✅ For ethers v6+
  
  console.log("WhitelistToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

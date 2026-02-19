const { ethers } = require("hardhat");

( async () =>
{
  const factory = await ethers.getContractFactory("SocialApp");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("Voting contract deployed to: ", await contract.getAddress());
})().catch((error) =>
{
    console.log(error);
    process.exitCode = -1;
})
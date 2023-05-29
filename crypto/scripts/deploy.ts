import { ethers } from "hardhat";

async function main() {

  let [signer] = await ethers.getSigners();
  const CreditUnion = await ethers.getContractFactory("CreditUnion", signer);
  const creditUnion = await CreditUnion.deploy("test",[], [], "owner name");

  await creditUnion.deployed();

  console.log(`owner of ther contract is ${signer.address}`);
  console.log("credit union has been deployed!");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

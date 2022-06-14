// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers as ETH } from "ethers";
import { ethers, waffle } from "hardhat";

interface Memo {
  from: string;
  timestamp: ETH.BigNumber;
  name: string;
  message: string;
}

async function main() {
  // const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();
  await buyMeCoffee.deployed();

  console.log("BuMeCoffee deployed to ", buyMeCoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

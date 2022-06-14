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
// returns the ETH balance of a given address
async function getBalance(address: string) {
  const balanceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

// logs the ETH blances for a list of addresses
async function printBlances(addresses: string[]) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos: Memo[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tiperAddress = memo.from;
    const message = memo.message;

    console.log(
      `At ${timestamp}, ${tipper} (${tiperAddress}) said: ${message}`
    );
  }
}
async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();
  await buyMeCoffee.deployed();

  console.log("BuMeCoffee deployed to ", buyMeCoffee.address);

  // check blances before purchase.
  const addresses = [owner.address, tipper.address, buyMeCoffee.address];
  console.log("== start ==");
  await printBlances(addresses);

  // default tip value
  const tip = { value: ethers.utils.parseEther("1") };
  // buy owner some coffee
  await buyMeCoffee.connect(tipper).buyCoffee("reza", "you deserve it", tip);
  await buyMeCoffee.connect(tipper2).buyCoffee("mehr", "hope you like it", tip);
  await buyMeCoffee.connect(tipper2).buyCoffee("jack", "enjoy it!", tip);

  console.log("== balance after tip paid ==");
  await printBlances(addresses);

  // withdraw funds
  await buyMeCoffee.connect(owner).withdrawTips();
  console.log("== balance after withdraw ==");
  await printBlances(addresses);

  // print memos
  const memos = await buyMeCoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();
// run file from terminal with arguments of proposal names: yarn ts-node --files ./scripts/deployBallot.ts <proposal[0]> <proposal[1]> <proposal[2]> ...
const TOKEN_ADDRESS = "0xd84744BC999c909828122779b4961FDc34f4E0d6";
const BLOCK_NUMBER = 35626404;

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const proposals = process.argv.slice(2);
  if (proposals.length < 1) throw new Error("Missing parameters: proposals");

  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );
  const pkey = process.env.PRIVATE_KEY;
  if (!pkey || pkey.length <= 0) throw new Error("Missing private key");
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);
  console.log(`Connected to ${provider.network.name}`);

  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotFactory = new Ballot__factory(signer);
  console.log("Deploying contract ...");
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    TOKEN_ADDRESS,
    BLOCK_NUMBER
  );
  const deployTx = await ballotContract.deployTransaction.wait();
  console.log(`The contract was deployed on the Polygon Mumbai testnet at address: ${ballotContract.address} 
    at block ${deployTx.blockNumber}`);
  console.log(`Transaction hash: ${deployTx.transactionHash}`);
};

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
})
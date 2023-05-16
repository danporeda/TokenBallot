import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const BALLOT_ADDRESS = "0xBc0B36Bb2DF42Bc718349416973c18Ad3Bb72971";

const main = async () => {
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );

  const pkey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(BALLOT_ADDRESS);
  console.log(
    `Contract factory created, attached to ballot at address ${ballotContract.address}`
  );
  
  const proposalArray = [];
  for (let i=0; i < 3; i++) {
    let proposal = await ballotContract.proposals(i);
    proposalArray.push(proposal);
  }
  for (let i=0; i < proposalArray.length; i++) {
    console.log(`Proposal [${i}] ${ethers.utils.parseBytes32String(proposalArray[i].name)} has ${proposalArray[i].voteCount} votes`);
  }
  
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
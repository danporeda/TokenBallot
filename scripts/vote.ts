import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// run file from terminal with proposal vote: yarn ts-node --files ./scripts/vote.ts 0

//adjust voteAmount to reflect your amount of votes 
const voteAmount = ethers.utils.parseEther("0.01");

const ballotAddress = "0xBc0B36Bb2DF42Bc718349416973c18Ad3Bb72971"; 
const tokenContractAddress = "0xd84744BC999c909828122779b4961FDc34f4E0d6";

const main = async () => {
  const vote = parseInt(process.argv[2]);
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );

  const pkey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(ballotAddress);
  console.log(
    `Contract factory created, attached to ballot at address ${ballotContract.address}`
  );
  const votePower = await ballotContract.votingPower(signer.address);
  console.log(`voting power called from ballot: ${votePower}`);
  console.log(`Casting vote of ${vote} to ballot...`);
  const castingVoteTX = await ballotContract.vote(vote, voteAmount);
  await castingVoteTX.wait();

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
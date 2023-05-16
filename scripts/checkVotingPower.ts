import { ethers } from "hardhat";
import { Ballot__factory, MyERC20Token__factory, TokenSale__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

// create a .env file with your PRIVATE_KEY and ALCHEMY_API_KEY. 

// token contract is on Polygon Mumbai testnet.
const tokenSaleAddress = "0x4d6670D962A5228442588f0c35CAC89EB9248f64";
const tokenContractAddress = "0xd84744BC999c909828122779b4961FDc34f4E0d6";
const ballotContractAddress = "0xBc0B36Bb2DF42Bc718349416973c18Ad3Bb72971";
const targetBlockNumber = 35626404;

async function main() {
    const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_API_KEY);
    const pkey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(`${pkey}`);
    const signer = wallet.connect(provider);

    const tokenSaleFactory = new TokenSale__factory(signer);
    const tokenSaleContract = tokenSaleFactory.attach(tokenSaleAddress);

    const tokenFactory = new MyERC20Token__factory(signer);
    const tokenContract = tokenFactory.attach(tokenContractAddress); 
    const tokenBalance = await tokenContract.balanceOf(signer.address);
    console.log(`Your token balance called from the token contract is ${tokenBalance} at block ${await provider.getBlockNumber()}`);

    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = ballotFactory.attach(ballotContractAddress);
    const getVotesTx = await ballotContract.votingPower(signer.address);
    console.log(`Your vote power from the ballot contract call is ${getVotesTx}`);
    const getVotesFromToken = await tokenContract.getVotes(signer.address);
    console.log(`Your vote power called from the token contract now is: ${getVotesFromToken}`);
    const getPastVotesFromToken = await tokenContract.getPastVotes(signer.address, targetBlockNumber);
    console.log(`Your vote power called from the token contract at block 35626404 is: ${getPastVotesFromToken}`);
}


    main().catch((error) =>{
        console.error(error);
        process.exitCode = 1;
    })
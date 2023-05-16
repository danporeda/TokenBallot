import { ethers } from "hardhat";
import { MyERC20Token__factory, TokenSale__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_API_KEY);
    const pkey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(`${pkey}`);
    const signer = wallet.connect(provider);

    const tokenFactory = new MyERC20Token__factory(signer);
    const tokenContract = await tokenFactory.deploy();
    await tokenContract.deployed();
    console.log(`token Contract deployed, address: ${tokenContract.address}`);

    const tokenSaleFactory = new TokenSale__factory(signer);
    const tokenSaleContract = await tokenSaleFactory.deploy(10, tokenContract.address);
    await tokenSaleContract.deployed();
    console.log(`The tokensale contract address: ${tokenSaleContract.address}`);
    const minterRole = await tokenContract.MINTER_ROLE();
    const giveRoleTx = await tokenContract.grantRole(minterRole, tokenSaleContract.address);
    await giveRoleTx.wait();
}

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
})
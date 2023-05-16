import { ethers } from "hardhat";
import { MyERC20Token__factory, TokenSale__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

// run file from terminal with MATIC amount: yarn ts-node --files ./scripts/buyTokens.ts 0.01
// NOTE: the tokensale contract mints MTK by a ratio of MATIC * 100. So passing 0.01 to run the script should yield 1.0 MTK.

// create a .env file with your PRIVATE_KEY and ALCHEMY_API_KEY. The private key's account will be minted to. 

// token contract is on Polygon Mumbai testnet.
const tokenSaleAddress = "0x4d6670D962A5228442588f0c35CAC89EB9248f64";
const tokenContractAddress = "0xd84744BC999c909828122779b4961FDc34f4E0d6";

async function main() {
    const amount = process.argv[2];
    const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_API_KEY);
    const pkey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(`${pkey}`);
    const signer = wallet.connect(provider);

    const tokenSaleFactory = new TokenSale__factory(signer);
    const tokenSaleContract = tokenSaleFactory.attach(tokenSaleAddress);
    const buyTokensTx = await tokenSaleContract.connect(signer)
        .buyTokens({value: ethers.utils.parseEther(amount)});
    const buyTokensTxReceipt = await buyTokensTx.wait();
    console.log(`You purchased ${ethers.utils.parseEther(amount)} 
        tokens at block ${buyTokensTxReceipt.blockNumber}`);
    const tokenFactory = new MyERC20Token__factory(signer);
    const tokenContract = tokenFactory.attach(tokenContractAddress); 
    const tokenBalance = await tokenContract.balanceOf(signer.address);
    console.log(`Your token balance is ${tokenBalance} at block ${await provider.getBlock("latest")}`);
}


    main().catch((error) =>{
        console.error(error);
        process.exitCode = 1;
    })
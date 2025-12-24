

import { Contract, ethers, formatEther, Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import type { AssetMetaData } from "../../types.js";
import { type CompoundProtocolConstants } from "./types.js";
//@ts-ignore
import abi from "./abi.json" with {type:"json"};

const provider = new ethers.JsonRpcProvider(
  "https://polygon-mainnet.infura.io/v3/3a0bf1b6f69c4750b475bb4aa42d9dca"
);


const tokenABI = ['function balanceOf(address account) external view returns (uint256)']


// export async function queryBalanceComp(assetMetaData: AssetMetaData,account: string): Promise<bigint> {
//     const token = new ethers.Contract(
//         assetMetaData.compPoolAddress,
//         tokenABI,
//         provider
//       );
//     //@ts-ignore
//     let balance: bigint = await token.balanceOf(account);
//     return balance;
//   }
  

export async function supplyToCompound(assetMetaData: AssetMetaData,amount: bigint,pkey:string){
  const signer = (new Wallet(pkey, provider));
  const pool = new Contract(assetMetaData.compPoolAddress, abi, signer);
  //@ts-ignore
  const tx = await pool.supply(assetMetaData.assetAddress, amount);

  return tx;
}


export async function withdrawFromCompound(assetMetaData: AssetMetaData,amount: bigint,pkey:string){

  const {compPoolAddress,assetAddress} = assetMetaData;
  const signer = new Wallet(pkey, provider);
  const pool = new Contract(compPoolAddress, abi, signer);
  //@ts-ignore
  const tx = await pool.withdraw(assetAddress, amount);
  return tx;
}

type BatchReturn = [bigint,bigint, bigint, bigint, bigint, bigint, bigint];
export async function getDetailsCompound(
  assetMetaData: AssetMetaData
): Promise<CompoundProtocolConstants> {
  const {compPoolAddress,assetAddress,decimals} = assetMetaData;


  //const defaultPool = "0xF25212E676D1F7F89Cd72fFEe66158f541246445";

  const pool = new Contract(
    compPoolAddress,
    abi,
    provider
  );


  const token = new Contract(assetAddress,tokenABI,provider)

  //@ts-ignore
  let promises: Promise<bigint>[] = [
    //@ts-ignore
    token.balanceOf(compPoolAddress),
    //@ts-ignore
    pool.totalBorrow(),
    //@ts-ignore
    pool.totalSupply(),
    //@ts-ignore
    pool.supplyKink(),
    //@ts-ignore
    pool.supplyPerSecondInterestRateBase(),
    //@ts-ignore
    pool.supplyPerSecondInterestRateSlopeLow(),
    //@ts-ignore
    pool.supplyPerSecondInterestRateSlopeHigh(),
  ];

  try {
    const [
      availableLiquidity,
      totalBorrow,
      totalSupply,
      supplyKink,
      supplyPerSecondInterestRateBase,
      supplyPerSecondInterestRateSlopeLow,
      supplyPerSecondInterestRateSlopeHigh,
    ] = (await Promise.all(promises)) as BatchReturn;

    return {
      decimals,
      totalBorrow,
      totalSupply,
      availableLiquidity,
      supplyKink,
      supplyPerSecondInterestRateBase,
      supplyPerSecondInterestRateSlopeHigh,
      supplyPerSecondInterestRateSlopeLow,
    };
  } catch (err) {
    throw new Error(`Failed to fetch Compound details: ${err}`);
  }
}




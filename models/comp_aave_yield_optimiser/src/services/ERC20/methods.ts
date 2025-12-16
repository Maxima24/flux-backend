import { ethers } from "ethers";
import type { AssetMetaData } from "../../types.js";
import abi from "./abi.json" with {type:"json"};
const provider = new ethers.JsonRpcProvider(
  "https://polygon-mainnet.infura.io/v3/3a0bf1b6f69c4750b475bb4aa42d9dca"
);


export const getUserAssetBalance = async (assetAddress:string,user:string) => {
  let contract = new ethers.Contract(assetAddress,abi,provider);  
  //@ts-ignore
  let balance = await contract.balanceOf(user);
  return balance;
}


export const approveAssetSpender = async (assetAddress:string,spender:string,amount:bigint) => {
  let contract = new ethers.Contract(assetAddress,abi,provider);
  //@ts-ignore
  let tx = await contract.approve(spender,amount);
  return tx;
}

export const transferAssetToUser = async (assetAddress:string,user:string,amount:bigint) => {
  let contract = new ethers.Contract(assetAddress,abi,provider);
  //@ts-ignore
  let tx = await contract.transfer(user,amount);
  return tx;
}


export const transferAssetFromUser = async (assetMetaData: AssetMetaData,from:string,to:string,amount:bigint) => {
  const { assetAddress } = assetMetaData;
  let contract = new ethers.Contract(assetAddress,abi,provider);
  //@ts-ignore
  let tx = await contract.transferFrom(from,to,amount);
  return tx;
}

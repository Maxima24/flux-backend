import { ethers } from "ethers";
import abi from "./abi.json" with { type: "json" };
const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/3a0bf1b6f69c4750b475bb4aa42d9dca");
export const getUserAssetBalance = async (assetAddress, user) => {
    let contract = new ethers.Contract(assetAddress, abi, provider);
    //@ts-ignore
    let balance = await contract.balanceOf(user);
    return balance;
};
export const approveAssetSpender = async (assetAddress, spender, amount) => {
    let contract = new ethers.Contract(assetAddress, abi, provider);
    //@ts-ignore
    let tx = await contract.approve(spender, amount);
    return tx;
};
export const transferAssetToUser = async (assetAddress, user, amount) => {
    let contract = new ethers.Contract(assetAddress, abi, provider);
    //@ts-ignore
    let tx = await contract.transfer(user, amount);
    return tx;
};
export const transferAssetFromUser = async (assetMetaData, from, to, amount) => {
    const { assetAddress } = assetMetaData;
    let contract = new ethers.Contract(assetAddress, abi, provider);
    //@ts-ignore
    let tx = await contract.transferFrom(from, to, amount);
    return tx;
};
//# sourceMappingURL=methods.js.map
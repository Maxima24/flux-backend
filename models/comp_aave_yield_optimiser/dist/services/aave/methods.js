import { AaveV3Polygon } from "@bgd-labs/aave-address-book";
import art from "./pooldata.abi.json" with { type: "json" };
// Ensure calculateCompoundedRate and rayToWad are imported correctly
import { ethers, formatUnits, parseUnits } from "ethers";
const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/3a0bf1b6f69c4750b475bb4aa42d9dca");
//   export async function queryBalanceAave(assetMetaData: AssetMetaData,account: string): Promise<bigint> {
//     const {atokenAddress} = assetMetaData;
//     const token = new ethers.Contract(
//         atokenAddress,
//         tokenABI,
//         provider
//       );
//     //@ts-ignore
//     let balance: bigint = await token.balanceOf(account);
//     return balance;
//   }
export async function getDetailsAave(assetMetaData) {
    const { aavePoolAddress } = assetMetaData;
    // 1. Instantiate the Contract
    const dataProvider = new ethers.Contract(AaveV3Polygon.UI_POOL_DATA_PROVIDER, art, provider);
    try {
        //@ts-ignore
        const resultList = await dataProvider.getReservesData(LENDING_POOL_ADDRESSES_PROVIDER);
        let reserves = resultList[0];
        let reserve;
        for (const res of reserves) {
            if (res.symbol == assetMetaData.symbol) {
                reserve = res;
            }
        }
        if (reserve) {
            return reserve;
        }
        else {
            throw new Error("Reserve not found");
        }
    }
    catch (error) {
        throw new Error(`Failed to fetch Aave details: ${error}`);
    }
}
//# sourceMappingURL=methods.js.map
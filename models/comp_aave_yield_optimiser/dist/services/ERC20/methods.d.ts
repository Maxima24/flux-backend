import type { AssetMetaData } from "../../types.js";
export declare const getUserAssetBalance: (assetAddress: string, user: string) => Promise<any>;
export declare const approveAssetSpender: (assetAddress: string, spender: string, amount: bigint) => Promise<any>;
export declare const transferAssetToUser: (assetAddress: string, user: string, amount: bigint) => Promise<any>;
export declare const transferAssetFromUser: (assetMetaData: AssetMetaData, from: string, to: string, amount: bigint) => Promise<any>;
//# sourceMappingURL=methods.d.ts.map
import type { AssetMetaData } from "../../types.js";
import { type CompoundProtocolConstants } from "./types.js";
export declare function supplyToCompound(assetMetaData: AssetMetaData, amount: bigint, pkey: string): Promise<any>;
export declare function withdrawFromCompound(assetMetaData: AssetMetaData, amount: bigint, pkey: string): Promise<any>;
export declare function getDetailsCompound(assetMetaData: AssetMetaData): Promise<CompoundProtocolConstants>;
//# sourceMappingURL=methods.d.ts.map
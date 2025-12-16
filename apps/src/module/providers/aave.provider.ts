import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { parseAbi } from 'viem';
import type { YieldData } from '../../../common/types/yield.types';

@Injectable()
export class AaveProvider {
  private readonly logger = new Logger(AaveProvider.name);

  // Aave V3 Pool on Polygon
  private readonly AAVE_POOL = '0x794a61358D6845594F94dc1DB02A252b5b4814aD' as const;
  
  // Asset addresses on Polygon
  private readonly ASSETS = {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  } as const;

  constructor(
    private readonly blockchain: BlockchainService,
    private readonly config: ConfigService,
  ) {}

  async getYield(asset: string): Promise<YieldData> {
    const assetAddress = this.ASSETS[asset as keyof typeof this.ASSETS];
    
    if (!assetAddress) {
      throw new Error(`Unsupported asset for Aave: ${asset}`);
    }

    try {
      // Aave Pool ABI (simplified - just getReserveData)
      const aaveAbi = parseAbi([
        'function getReserveData(address asset) external view returns (tuple(uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt))'
      ]);

      const reserveData = await this.blockchain.readContract<any>({
        address: this.AAVE_POOL,
        abi: aaveAbi,
        functionName: 'getReserveData',
        args: [assetAddress],
      });

      // Aave rates are in Ray (27 decimals)
      const RAY = 10n ** 27n;
      const liquidityRate = Number(reserveData.currentLiquidityRate) / Number(RAY);

      // Convert to APY: (1 + rate/seconds_per_year)^seconds_per_year - 1
      const SECONDS_PER_YEAR = 31536000;
      const apy = (Math.pow(1 + liquidityRate / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;

      this.logger.debug(`Aave ${asset} APY: ${apy.toFixed(4)}%`);

      return {
        protocol: 'aave',
        asset,
        apy,
        tvl: 0, // Would need additional call to get TVL
        source: 'direct',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Aave yield for ${asset}:`, error);
      throw error;
    }
  }
}
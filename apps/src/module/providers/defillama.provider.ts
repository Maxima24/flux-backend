import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { YieldData } from '../../../common/types/yield.types';

interface DeFiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
}

@Injectable()
export class DeFiLlamaProvider {
  private readonly logger = new Logger(DeFiLlamaProvider.name);
  private readonly apiUrl = 'https://yields.llama.fi/pools';

  constructor(private readonly httpService: HttpService) {}

  async getYield(protocol: string, asset: string): Promise<YieldData> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: DeFiLlamaPool[] }>(this.apiUrl)
      );

      const pools = response.data.data;

      // Filter for Polygon + protocol + asset
      const relevantPool = pools.find(p => 
        p.chain === 'Polygon' &&
        p.project.toLowerCase() === protocol.toLowerCase() &&
        p.symbol.includes(asset)
      );

      if (!relevantPool) {
        throw new Error(`No pool found for ${protocol}/${asset} on Polygon`);
      }

      this.logger.debug(
        `DeFiLlama: ${protocol} ${asset} = ${relevantPool.apy.toFixed(2)}% APY`
      );

      return {
        protocol,
        asset,
        apy: relevantPool.apy,
        tvl: relevantPool.tvlUsd,
        source: 'defillama',
        timestamp: new Date(),
        metadata: {
          apyBase: relevantPool.apyBase,
          apyReward: relevantPool.apyReward,
        },
      };
    } catch (error) {
      this.logger.error(`DeFiLlama fetch failed for ${protocol}/${asset}:`, error.message);
      throw error;
    }
  }
}
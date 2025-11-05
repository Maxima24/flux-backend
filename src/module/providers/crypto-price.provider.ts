import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from '../blockchain/blockchain.service';
import { parseAbi } from 'viem';
import type { Address } from 'viem';

// Chainlink Price Feed ABI (AggregatorV3Interface)
const CHAINLINK_ABI = parseAbi([
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
  'function description() external view returns (string)',
]);

export interface CryptoPrice {
  symbol: string;
  price: number; // USD price
  decimals: number;
  updatedAt: Date;
  source: 'chainlink' | 'coingecko';
}

@Injectable()
export class CryptoPriceProvider {
  private readonly logger = new Logger(CryptoPriceProvider.name);

  // Chainlink Price Feed addresses on Polygon (mainnet)
  private readonly PRICE_FEEDS: Record<string, Address> = {
    MATIC: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0', // MATIC/USD
    USDC: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',  // USDC/USD
    USDT: '0x0A6513e40db6EB1b165753AD52E80663aeA50545',  // USDT/USD
    ETH: '0xF9680D99D6C9589e2a93a78A04A279e509205945',   // ETH/USD
    BTC: '0xc907E116054Ad103354f2D350FD2514433D57F6f0',   // BTC/USD
  };

  constructor(
    private readonly blockchain: BlockchainService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Get price for a specific crypto from Chainlink
   */
  async getPriceFromChainlink(symbol: string): Promise<CryptoPrice> {
    const feedAddress = this.PRICE_FEEDS[symbol.toUpperCase()];

    if (!feedAddress) {
      throw new Error(`No Chainlink price feed found for ${symbol}`);
    }

    try {
      // Get latest round data
      const roundData = await this.blockchain.readContract<any>({
        address: feedAddress,
        abi: CHAINLINK_ABI,
        functionName: 'latestRoundData',
      });

      // Get decimals
      const decimals = await this.blockchain.readContract<number>({
        address: feedAddress,
        abi: CHAINLINK_ABI,
        functionName: 'decimals',
      });

      // Calculate price
      const price = Number(roundData.answer) / Math.pow(10, decimals);

      this.logger.debug(`Chainlink ${symbol} price: $${price.toFixed(4)}`);

      return {
        symbol: symbol.toUpperCase(),
        price,
        decimals,
        updatedAt: new Date(Number(roundData.updatedAt) * 1000),
        source: 'chainlink',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Chainlink price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get price for a specific crypto (fallback to CoinGecko if Chainlink fails)
   */
  async getPrice(symbol: string): Promise<CryptoPrice> {
    try {
      // Try Chainlink first
      return await this.getPriceFromChainlink(symbol);
    } catch (error) {
      this.logger.warn(`Chainlink failed for ${symbol}, falling back to CoinGecko`);
      return await this.getPriceFromCoinGecko(symbol);
    }
  }

  /**
   * Get price from CoinGecko API (fallback)
   */
  async getPriceFromCoinGecko(symbol: string): Promise<CryptoPrice> {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const price = data[coinId]?.usd;

      if (!price) {
        throw new Error(`Price not found for ${symbol} on CoinGecko`);
      }

      this.logger.debug(`CoinGecko ${symbol} price: $${price.toFixed(4)}`);

      return {
        symbol: symbol.toUpperCase(),
        price,
        decimals: 2, // CoinGecko prices are typically to 2 decimals
        updatedAt: new Date(),
        source: 'coingecko',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch CoinGecko price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple prices at once
   */
  async getPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
    const results: Record<string, CryptoPrice> = {};

    for (const symbol of symbols) {
      try {
        results[symbol.toUpperCase()] = await this.getPrice(symbol);
      } catch (error) {
        this.logger.error(`Failed to get price for ${symbol}:`, error);
        // Continue with other symbols
      }
    }

    return results;
  }

  /**
   * Map symbol to CoinGecko ID
   */
  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      MATIC: 'matic-network',
      USDC: 'usd-coin',
      USDT: 'tether',
      ETH: 'ethereum',
      BTC: 'bitcoin',
    };

    const coinId = mapping[symbol.toUpperCase()];
    if (!coinId) {
      throw new Error(`Unknown CoinGecko ID for ${symbol}`);
    }

    return coinId;
  }

  /**
   * Health check for price feeds
   */
  async healthCheck(): Promise<{
    chainlink: boolean;
    coingecko: boolean;
    lastPrices: Record<string, number>;
  }> {
    const results = {
      chainlink: false,
      coingecko: false,
      lastPrices: {} as Record<string, number>,
    };

    try {
      // Test Chainlink
      const maticPrice = await this.getPriceFromChainlink('MATIC');
      results.chainlink = true;
      results.lastPrices.MATIC = maticPrice.price;
    } catch (error) {
      this.logger.warn('Chainlink health check failed');
    }

    try {
      // Test CoinGecko
      const ethPrice = await this.getPriceFromCoinGecko('ETH');
      results.coingecko = true;
      results.lastPrices.ETH = ethPrice.price;
    } catch (error) {
      this.logger.warn('CoinGecko health check failed');
    }

    return results;
  }
}

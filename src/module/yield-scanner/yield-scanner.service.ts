import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { AaveProvider } from '../providers/aave.provider';
import { QuickswapProvider } from '../providers/quickswap.provider';
import { DeFiLlamaProvider } from '../providers/defillama.provider';

import type { YieldData } from '../../common/types/yield.types';

@Injectable()
export class YieldScannerService {
  private readonly logger = new Logger(YieldScannerService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly aaveProvider: AaveProvider,
    private readonly quickswapProvider: QuickswapProvider,
    private readonly defillamaProvider: DeFiLlamaProvider,
  ) {}

  /**
   * Scheduled job - runs every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledYieldScan() {
    this.logger.log('🔄 Starting scheduled yield scan...');
    
    try {
      const yields = await this.scanAllProtocols('USDC');
      this.logger.log(`✅ Scanned ${yields.length} protocols`);
      
      // Also scan USDT
      const usdtYields = await this.scanAllProtocols('USDT');
      this.logger.log(`✅ Scanned ${usdtYields.length} protocols for USDT`);
    } catch (error) {
      this.logger.error('❌ Yield scan failed:', error);
    }
  }

  /**
   * Main orchestration - fetch all yields for an asset
   */
  async scanAllProtocols(asset: string = 'USDC'): Promise<YieldData[]> {
    const protocols = await this.prisma.client.protocol.findMany({
      where: { isActive: true },
    });

    this.logger.debug(`Scanning ${protocols.length} protocols for ${asset}`);

    // Parallel fetching for speed
    const results = await Promise.allSettled(
      protocols.map(p => this.fetchProtocolYield(p.name, asset))
    );

    const validYields = results
      .filter((r): r is PromiseFulfilledResult<YieldData> => r.status === 'fulfilled')
      .map(r => r.value);

    // Log failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      this.logger.warn(`${failures.length} protocols failed to fetch`);
    }

    // Cache in Redis
    await this.cacheYields(validYields);

    // Persist to Postgres
    await this.persistYields(validYields);

    return validYields;
  }

  /**
   * Fetch yield from specific protocol (with fallback)
   */
  private async fetchProtocolYield(protocol: string, asset: string): Promise<YieldData> {
    try {
      // Try DeFiLlama first (fast aggregator)
      return await this.defillamaProvider.getYield(protocol, asset);
    } catch (error) {
      this.logger.warn(`DeFiLlama failed for ${protocol}, using direct read`);
      
      // Fallback to direct contract calls
      switch (protocol.toLowerCase()) {
        case 'aave':
          return await this.aaveProvider.getYield(asset);
        case 'quickswap':
          return await this.quickswapProvider.getYield(asset);
        default:
          throw new Error(`Unsupported protocol: ${protocol}`);
      }
    }
  }

  /**
   * Cache yields in Redis
   */
  private async cacheYields(yields: YieldData[]): Promise<void> {
    try {
      await Promise.all(
        yields.map(y => 
          this.cacheManager.set(
            `yields:${y.asset}:${y.protocol}`,
            y,
            300 // 5 min TTL
          )
        )
      );
      this.logger.debug(`Cached ${yields.length} yields`);
    } catch (error) {
      this.logger.error('Failed to cache yields:', error);
      // Don't throw - caching failure shouldn't break the flow
    }
  }

  /**
   * Persist to Postgres via Prisma
   */
  private async persistYields(yields: YieldData[]): Promise<void> {
    try {
      // Get protocol IDs
      const protocols = await this.prisma.client.protocol.findMany({
        where: {
          name: { in: yields.map(y => y.protocol) },
        },
      });

      const protocolMap = new Map(protocols.map(p => [p.name, p.id]));

      // Filter out yields without matching protocols
      const validYields = yields.filter(y => protocolMap.has(y.protocol));

      if (validYields.length === 0) {
        this.logger.warn('No valid yields to persist');
        return;
      }

      // Bulk insert (Prisma createMany)
      await this.prisma.client.yieldSnapshot.createMany({
        data: validYields.map(y => ({
          protocolId: protocolMap.get(y.protocol)!,
          asset: y.asset,
          apy: y.apy,
          tvl: y.tvl || 0,
          source: y.source,
          metadata: y.metadata || {},
        })),
      });

      this.logger.debug(`Persisted ${validYields.length} yields to database`);
    } catch (error) {
      this.logger.error('Failed to persist yields:', error);
      // Don't throw - persistence failure shouldn't break the flow
    }
  }

  /**
   * Get best yield (from cache if available)
   */
  async getBestYield(asset: string): Promise<YieldData | null> {
    try {
      // Try cache first
      const cachePattern = `yields:${asset}:*`;
      const keys = await this.getCacheKeys(cachePattern);
      
      if (keys.length > 0) {
        const cachedYields = await Promise.all(
          keys.map(key => this.cacheManager.get<YieldData>(key))
        );
        
        const validYields = cachedYields.filter((y): y is YieldData => y !== null);
        
        if (validYields.length > 0) {
          return validYields.reduce((best, current) => 
            current.apy > best.apy ? current : best
          );
        }
      }

      // Cache miss - query database
      return await this.getBestYieldFromDB(asset);
    } catch (error) {
      this.logger.error(`Failed to get best yield for ${asset}:`, error);
      return null;
    }
  }

  /**
   * Get best yield from database
   */
  private async getBestYieldFromDB(asset: string): Promise<YieldData | null> {
    const latest = await this.prisma.client.yieldSnapshot.findMany({
      where: { asset },
      orderBy: { timestamp: 'desc' },
      take: 10,
      distinct: ['protocolId'],
      include: { protocol: true },
    });

    if (latest.length === 0) return null;

    const bestSnapshot = latest.reduce((best, current) => 
      current.apy > best.apy ? current : best
    );

    return {
      protocol: bestSnapshot.protocol.name,
      asset: bestSnapshot.asset,
      apy: bestSnapshot.apy.toNumber(),
      tvl: bestSnapshot.tvl?.toNumber() || 0,
      source: bestSnapshot.source,
      timestamp: bestSnapshot.timestamp,
    };
  }

  /**
   * Get all yields for an asset
   */
  async getAllYields(asset: string): Promise<YieldData[]> {
    try {
      // Try cache first
      const cachePattern = `yields:${asset}:*`;
      const keys = await this.getCacheKeys(cachePattern);
      
      if (keys.length > 0) {
        const cachedYields = await Promise.all(
          keys.map(key => this.cacheManager.get<YieldData>(key))
        );
        
        const validYields = cachedYields.filter((y): y is YieldData => y !== null);
        
        if (validYields.length > 0) {
          this.logger.debug(`Returning ${validYields.length} yields from cache`);
          return validYields;
        }
      }

      // Cache miss - query database
      this.logger.debug('Cache miss, fetching from database');
      return await this.getAllYieldsFromDB(asset);
    } catch (error) {
      this.logger.error(`Failed to get all yields for ${asset}:`, error);
      return [];
    }
  }

  /**
   * Get all yields from database
   */
  private async getAllYieldsFromDB(asset: string): Promise<YieldData[]> {
    const snapshots = await this.prisma.client.yieldSnapshot.findMany({
      where: { asset },
      orderBy: { timestamp: 'desc' },
      distinct: ['protocolId'],
      take: 20,
      include: { protocol: true },
    });

    return snapshots.map(s => ({
      protocol: s.protocol.name,
      asset: s.asset,
      apy: s.apy.toNumber(),
      tvl: s.tvl?.toNumber() || 0,
      source: s.source,
      timestamp: s.timestamp,
    }));
  }

  /**
   * Get yield for specific protocol
   */
  async getProtocolYield(protocol: string, asset: string): Promise<YieldData | null> {
    try {
      // Try cache
      const cached = await this.cacheManager.get<YieldData>(
        `yields:${asset}:${protocol}`
      );
      
      if (cached) return cached;

      // Fetch fresh data
      return await this.fetchProtocolYield(protocol, asset);
    } catch (error) {
      this.logger.error(`Failed to get yield for ${protocol}/${asset}:`, error);
      return null;
    }
  }

  /**
   * Get cache keys matching pattern (helper method)
   */
  private async getCacheKeys(pattern: string): Promise<string[]> {
    try {
      // Access Redis directly through cache manager
      const store: any = this.cacheManager.stores;
      if (store && store.keys) {
        return await store.keys(pattern);
      }
      return [];
    } catch (error) {
      this.logger.error('Failed to get cache keys:', error);
      return [];
    }
  }

  /**
   * Force refresh yields for all protocols
   */
  async forceRefresh(asset: string = 'USDC'): Promise<YieldData[]> {
    this.logger.log(`Force refreshing yields for ${asset}`);
    
    // Clear cache for this asset
    const keys = await this.getCacheKeys(`yields:${asset}:*`);
    await Promise.all(keys.map(key => this.cacheManager.del(key)));
    
    // Fetch fresh data
    return await this.scanAllProtocols(asset);
  }

  /**
   * Get yield history for analytics
   */
  async getYieldHistory(protocol: string, asset: string, days: number = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const protocolRecord = await this.prisma.client.protocol.findUnique({
      where: { name: protocol },
    });

    if (!protocolRecord) {
      throw new Error(`Protocol ${protocol} not found`);
    }

    return await this.prisma.client.yieldSnapshot.findMany({
      where: {
        protocolId: protocolRecord.id,
        asset,
        timestamp: { gte: cutoffDate },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const [protocolCount, snapshotCount, latestSnapshot] = await Promise.all([
        this.prisma.client.protocol.count({ where: { isActive: true } }),
        this.prisma.client.yieldSnapshot.count(),
        this.prisma.client.yieldSnapshot.findFirst({
          orderBy: { timestamp: 'desc' },
          select: { timestamp: true },
        }),
      ]);

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isStale = !latestSnapshot || latestSnapshot.timestamp < fiveMinutesAgo;

      return {
        status: isStale ? 'stale' : 'healthy',
        activeProtocols: protocolCount,
        totalSnapshots: snapshotCount,
        lastUpdate: latestSnapshot?.timestamp,
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        activeProtocols: 0,
        totalSnapshots: 0,
        lastUpdate: null,
      };
    }
  }
}
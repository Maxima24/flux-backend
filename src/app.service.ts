import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './module/prisma/prisma.service';
import { BlockchainService } from './module/blockchain/blockchain.service';
import { YieldScannerService } from './module/yield-scanner/yield-scanner.service';
import { DecisionEngineService } from './module/decision_engine/decision_engine.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly yieldScanner: YieldScannerService,
    private readonly decisionEngine: DecisionEngineService,
  ) {}

  /**
   * Comprehensive health check for all services
   */
  async getHealthCheck() {
    this.logger.debug('Running health check...');

    try {
      const [database, blockchain, yieldScanner, decisionEngine] = await Promise.allSettled([
        this.checkDatabase(),
        this.blockchain.healthCheck(),
        this.yieldScanner.healthCheck(),
        this.decisionEngine.healthCheck(),
      ]);

      // Process results
      const dbHealth = database.status === 'fulfilled' ? database.value : { status: 'unhealthy', error: database.reason?.message };
      const blockchainHealth = blockchain.status === 'fulfilled' ? blockchain.value : { connected: false, error: blockchain.reason?.message };
      const yieldHealth = yieldScanner.status === 'fulfilled' ? yieldScanner.value : { status: 'unhealthy', error: yieldScanner.reason?.message };
      const decisionHealth = decisionEngine.status === 'fulfilled' ? decisionEngine.value : { status: 'unhealthy', error: decisionEngine.reason?.message };

      // Determine overall health
      const allHealthy = 
        dbHealth.status === 'healthy' &&
        blockchainHealth.connected &&
        (yieldHealth.status === 'healthy' || yieldHealth.status === 'stale') &&
        (decisionHealth.status === 'healthy' || decisionHealth.status === 'degraded');

      const overallStatus = allHealthy ? 'healthy' : 
        (dbHealth.status === 'healthy' && blockchainHealth.connected) ? 'degraded' : 'unhealthy';

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: dbHealth,
          blockchain: this.formatBlockchainHealth(blockchainHealth),
          yieldScanner: yieldHealth,
          decisionEngine: decisionHealth,
        },
        metadata: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase() {
    try {
      // Simple query to verify connection
      await this.prisma.client.$queryRaw`SELECT 1`;

      // Get some stats
      const [vaultCount, protocolCount, decisionCount] = await Promise.all([
        this.prisma.client.vault.count(),
        this.prisma.client.protocol.count(),
        this.prisma.client.agentDecision.count(),
      ]);

      return {
        status: 'healthy',
        vaults: vaultCount,
        protocols: protocolCount,
        decisions: decisionCount,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  /**
   * Format blockchain health data
   */
  private formatBlockchainHealth(health: any) {
    if (!health.connected) {
      return {
        status: 'unhealthy',
        connected: false,
        error: health.error,
      };
    }

    return {
      status: 'healthy',
      connected: true,
      blockNumber: health.blockNumber?.toString(),
      gasPrice: health.gasPrice ? `${Number(health.gasPrice) / 1e9} gwei` : 'N/A',
      operatorBalance: health.operatorBalance ? `${Number(health.operatorBalance) / 1e18} MATIC` : 'N/A',
    };
  }

  /**
   * Get system statistics
   */
  async getStatistics() {
    try {
      const [
        totalVaults,
        activeVaults,
        totalDeposited,
        totalDecisions,
        successfulRebalances,
      ] = await Promise.all([
        this.prisma.client.vault.count(),
        this.prisma.client.vault.count({ where: { isActive: true } }),
        this.prisma.client.vault.aggregate({
          _sum: { totalDeposited: true },
        }),
        this.prisma.client.agentDecision.count(),
        this.prisma.client.agentDecision.count({
          where: { wasExecuted: true },
        }),
      ]);

      return {
        vaults: {
          total: totalVaults,
          active: activeVaults,
          inactive: totalVaults - activeVaults,
        },
        tvl: Number(totalDeposited._sum.totalDeposited || 0),
        decisions: {
          total: totalDecisions,
          executed: successfulRebalances,
          pending: totalDecisions - successfulRebalances,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get statistics:', error);
      throw error;
    }
  }
}
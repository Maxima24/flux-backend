import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { YieldScannerService } from '../yield-scanner/yield-scanner.service';

import { YieldOptimizerStrategy } from './strategies/yield-optimizer.strategy';
import { ConservativeStrategy } from './strategies/conservative.strategy';
import { BaseStrategy } from './strategies/base-strategy';

import type { Decision, Position } from '../../common/types/decision.types';
import { DecisionType } from '@prisma/client';

@Injectable()
export class DecisionEngineService {
  private readonly logger = new Logger(DecisionEngineService.name);
  
  private strategies: Map<string, BaseStrategy>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly yieldScanner: YieldScannerService,
    private readonly yieldOptimizer: YieldOptimizerStrategy,
    private readonly conservative: ConservativeStrategy,
  ) {
    // Register available strategies
    this.strategies = new Map([
      ['yield-optimizer', this.yieldOptimizer],
      ['conservative', this.conservative],
    ]);
  }

  /**
   * Evaluate a vault and make rebalancing decision
   */
  async evaluateVault(vaultId: string): Promise<Decision> {
    this.logger.log(`Evaluating vault: ${vaultId}`);

    // Fetch vault data
    const vault = await this.prisma.client.vault.findUnique({
      where: { id: vaultId },
      include: { currentProtocol: true },
    });

    if (!vault) {
      throw new NotFoundException(`Vault ${vaultId} not found`);
    }

    if (!vault.isActive) {
      this.logger.warn(`Vault ${vaultId} is not active`);
      return {
        shouldRebalance: false,
        targetProtocol: null,
        expectedGainAPY: 0,
        gasCostUSD: 0,
        netBenefitAPY: 0,
        reasoning: 'Vault is not active',
        metadata: {},
      };
    }

    // Build position object
    const position: Position = {
      vaultId: vault.id,
      vaultAddress: vault.contractAddress,
      asset: vault.currentAsset,
      amount: Number(vault.currentBalance),
      currentProtocol: vault.currentProtocol?.name || null,
      currentAPY: await this.getCurrentAPY(vault.currentProtocolId),
      lastRebalance: vault.lastRebalance || undefined,
    };

    // Check if position has sufficient balance
    if (position.amount <= 0) {
      this.logger.warn(`Vault ${vaultId} has zero balance`);
      return {
        shouldRebalance: false,
        targetProtocol: null,
        expectedGainAPY: 0,
        gasCostUSD: 0,
        netBenefitAPY: 0,
        reasoning: 'Vault has no balance',
        metadata: {},
      };
    }

    // Get available yields
    const availableYields = await this.yieldScanner.getAllYields(vault.currentAsset);

    if (!availableYields || availableYields.length === 0) {
      this.logger.warn(`No yield data available for ${vault.currentAsset}`);
      return {
        shouldRebalance: false,
        targetProtocol: null,
        expectedGainAPY: 0,
        gasCostUSD: 0,
        netBenefitAPY: 0,
        reasoning: 'No yield data available',
        metadata: {},
      };
    }

    // Select strategy
    const strategy = this.strategies.get(vault.strategy);
    if (!strategy) {
      this.logger.error(`Unknown strategy: ${vault.strategy}`);
      throw new Error(`Strategy ${vault.strategy} not found`);
    }

    // Evaluate using selected strategy
    const decision = await strategy.evaluate(position, availableYields);

    // Log decision to database
    await this.logDecision(vault.id, decision);

    this.logger.log(
      `Decision for vault ${vaultId}: ${decision.shouldRebalance ? 'REBALANCE' : 'HOLD'} - ${decision.reasoning}`
    );

    return decision;
  }

  /**
   * Evaluate all active vaults
   */
  async evaluateAllVaults(): Promise<Map<string, Decision>> {
    const activeVaults = await this.prisma.client.vault.findMany({
      where: { isActive: true },
    });

    this.logger.log(`Evaluating ${activeVaults.length} active vaults`);

    const decisions = new Map<string, Decision>();

    for (const vault of activeVaults) {
      try {
        const decision = await this.evaluateVault(vault.id);
        decisions.set(vault.id, decision);
      } catch (error) {
        this.logger.error(`Failed to evaluate vault ${vault.id}:`, error);
        // Continue with other vaults even if one fails
      }
    }

    this.logger.log(`Completed evaluation. ${decisions.size} decisions made`);
    return decisions;
  }

  /**
   * Get current APY for a protocol
   */
  private async getCurrentAPY(protocolId: string | null): Promise<number> {
    if (!protocolId) return 0;

    try {
      const latestSnapshot = await this.prisma.client.yieldSnapshot.findFirst({
        where: { protocolId },
        orderBy: { timestamp: 'desc' },
      });

      return latestSnapshot ? Number(latestSnapshot.apy) : 0;
    } catch (error) {
      this.logger.error(`Failed to get current APY for protocol ${protocolId}:`, error);
      return 0;
    }
  }

  /**
   * Log decision to database for audit trail
   */
  private async logDecision(vaultId: string, decision: Decision): Promise<void> {
    try {
      const vault = await this.prisma.client.vault.findUnique({
        where: { id: vaultId },
        include: { currentProtocol: true },
      });

      if (!vault) {
        this.logger.error(`Cannot log decision: Vault ${vaultId} not found`);
        return;
      }

      // Get target protocol ID if rebalancing
      let toProtocolId: string | null = null;
      if (decision.targetProtocol) {
        const targetProtocol = await this.prisma.client.protocol.findUnique({
          where: { name: decision.targetProtocol },
        });
        toProtocolId = targetProtocol?.id || null;

        if (!toProtocolId) {
          this.logger.warn(
            `Target protocol ${decision.targetProtocol} not found in database`
          );
        }
      }

      await this.prisma.client.agentDecision.create({
        data: {
          vaultId,
          decisionType: decision.shouldRebalance 
            ? DecisionType.REBALANCE 
            : DecisionType.HOLD,
          fromProtocolId: vault.currentProtocolId,
          toProtocolId,
          amount: vault.currentBalance,
          expectedGainApy: decision.expectedGainAPY,
          estimatedGasCost: decision.gasCostUSD,
          netBenefitApy: decision.netBenefitAPY,
          wasExecuted: false,
          reason: decision.reasoning,
          metadata: decision.metadata || {},
        },
      });

      this.logger.debug(`Decision logged for vault ${vaultId}`);
    } catch (error) {
      this.logger.error(`Failed to log decision for vault ${vaultId}:`, error);
      // Don't throw - logging failure shouldn't break the decision flow
    }
  }

  /**
   * Get decision history for a vault
   */
  async getDecisionHistory(vaultId: string, limit: number = 50) {
    return this.prisma.client.agentDecision.findMany({
      where: { vaultId },
      include: {
        fromProtocol: true,
        toProtocol: true,
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get rebalance decisions pending execution
   */
  async getPendingRebalances() {
    return this.prisma.client.agentDecision.findMany({
      where: {
        decisionType: DecisionType.REBALANCE,
        wasExecuted: false,
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
        },
      },
      include: {
        vault: true,
        toProtocol: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark decision as executed
   */
  async markDecisionExecuted(decisionId: string): Promise<void> {
    try {
      await this.prisma.client.agentDecision.update({
        where: { id: decisionId },
        data: { wasExecuted: true },
      });
      this.logger.debug(`Decision ${decisionId} marked as executed`);
    } catch (error) {
      this.logger.error(`Failed to mark decision ${decisionId} as executed:`, error);
      throw error;
    }
  }

  /**
   * Get decision statistics
   */
  async getDecisionStats(vaultId?: string) {
    const where = vaultId ? { vaultId } : {};

    try {
      const [total, rebalances, holds, executed] = await Promise.all([
        this.prisma.client.agentDecision.count({ where }),
        this.prisma.client.agentDecision.count({
          where: { ...where, decisionType: DecisionType.REBALANCE },
        }),
        this.prisma.client.agentDecision.count({
          where: { ...where, decisionType: DecisionType.HOLD },
        }),
        this.prisma.client.agentDecision.count({
          where: { ...where, wasExecuted: true },
        }),
      ]);

      const successRate = rebalances > 0 ? (executed / rebalances) * 100 : 0;

      return {
        total,
        rebalances,
        holds,
        executed,
        pending: rebalances - executed,
        successRate: parseFloat(successRate.toFixed(2)),
        holdRate: total > 0 ? parseFloat(((holds / total) * 100).toFixed(2)) : 0,
      };
    } catch (error) {
      this.logger.error('Failed to get decision stats:', error);
      throw error;
    }
  }

  /**
   * Calculate theoretical performance (backtest)
   */
  async calculateTheoreticalPerformance(vaultId: string, days: number = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    try {
      const decisions = await this.prisma.client.agentDecision.findMany({
        where: {
          vaultId,
          createdAt: { gte: cutoffDate },
        },
        orderBy: { createdAt: 'asc' },
      });

      let totalGainAPY = 0;
      let totalGasCost = 0;
      let executedCount = 0;

      for (const decision of decisions) {
        if (decision.wasExecuted && decision.decisionType === DecisionType.REBALANCE) {
          totalGainAPY += Number(decision.expectedGainApy);
          totalGasCost += Number(decision.estimatedGasCost);
          executedCount++;
        }
      }

      const netGainAPY = totalGainAPY - (totalGasCost > 0 ? totalGasCost : 0);
      const averageGainPerMove = executedCount > 0 ? totalGainAPY / executedCount : 0;

      return {
        period: `${days} days`,
        totalDecisions: decisions.length,
        rebalancesExecuted: executedCount,
        totalExpectedGainAPY: parseFloat(totalGainAPY.toFixed(4)),
        totalGasCostUSD: parseFloat(totalGasCost.toFixed(4)),
        netGainAPY: parseFloat(netGainAPY.toFixed(4)),
        averageGainPerMove: parseFloat(averageGainPerMove.toFixed(4)),
        efficiency: totalGasCost > 0 
          ? parseFloat(((totalGainAPY / totalGasCost) * 100).toFixed(2)) 
          : 0,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate performance for vault ${vaultId}:`, error);
      throw error;
    }
  }

  /**
   * Get latest decision for a vault
   */
  async getLatestDecision(vaultId: string) {
    return this.prisma.client.agentDecision.findFirst({
      where: { vaultId },
      include: {
        fromProtocol: true,
        toProtocol: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Cancel pending rebalance decision
   */
  async cancelDecision(decisionId: string): Promise<void> {
    try {
      const decision = await this.prisma.client.agentDecision.findUnique({
        where: { id: decisionId },
      });

      if (!decision) {
        throw new NotFoundException(`Decision ${decisionId} not found`);
      }

      if (decision.wasExecuted) {
        throw new Error('Cannot cancel already executed decision');
      }

      // Update decision type to indicate cancellation
      await this.prisma.client.agentDecision.update({
        where: { id: decisionId },
        data: {
          decisionType: DecisionType.HOLD,
          reason: `${decision.reason} [CANCELLED]`,
        },
      });

      this.logger.log(`Decision ${decisionId} cancelled`);
    } catch (error) {
      this.logger.error(`Failed to cancel decision ${decisionId}:`, error);
      throw error;
    }
  }

  /**
   * Get all strategies available
   */
  getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Health check for decision engine
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    activeVaults: number;
    pendingDecisions: number;
    lastEvaluationTime?: Date;
  }> {
    try {
      const [activeVaults, pendingDecisions, lastDecision] = await Promise.all([
        this.prisma.client.vault.count({ where: { isActive: true } }),
        this.prisma.client.agentDecision.count({
          where: {
            decisionType: DecisionType.REBALANCE,
            wasExecuted: false,
          },
        }),
        this.prisma.client.agentDecision.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

      // Check if we've made any decisions in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const hasRecentActivity = lastDecision && lastDecision.createdAt > oneHourAgo;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (activeVaults === 0) {
        status = 'healthy'; // No vaults to evaluate
      } else if (!hasRecentActivity) {
        status = 'degraded'; // No recent decisions
      } else {
        status = 'healthy';
      }

      return {
        status,
        activeVaults,
        pendingDecisions,
        lastEvaluationTime: lastDecision?.createdAt,
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        activeVaults: 0,
        pendingDecisions: 0,
      };
    }
  }
}
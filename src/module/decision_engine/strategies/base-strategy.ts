import { Injectable, Logger } from '@nestjs/common';
import type { Decision, Position } from '../../../common/types/decision.types';
import type { YieldData } from '../../../common/types/yield.types';

export interface StrategyConfig {
  minAPYImprovement: number;
  minRebalanceInterval: number; // seconds
  minProfitUSD: number;
  maxGasCostRatio: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

@Injectable()
export abstract class BaseStrategy {
  protected readonly logger: Logger;
  protected abstract config: StrategyConfig;

  constructor(loggerContext: string) {
    this.logger = new Logger(loggerContext);
  }

  /**
   * Main decision method - must be implemented by strategies
   */
  abstract evaluate(
    position: Position,
    availableYields: YieldData[],
  ): Promise<Decision>;

  /**
   * Check if enough time has passed since last rebalance
   */
  protected hasEnoughTimePassed(position: Position): boolean {
    if (!position.lastRebalance) return true;

    const timeSinceLastRebalance = 
      (Date.now() - position.lastRebalance.getTime()) / 1000;

    const canRebalance = timeSinceLastRebalance >= this.config.minRebalanceInterval;

    if (!canRebalance) {
      const hoursRemaining = 
        (this.config.minRebalanceInterval - timeSinceLastRebalance) / 3600;
      this.logger.debug(
        `Cannot rebalance yet. ${hoursRemaining.toFixed(1)} hours remaining`
      );
    }

    return canRebalance;
  }

  /**
   * Filter protocols based on risk tolerance
   */
  protected filterByRisk(yields: YieldData[]): YieldData[] {
    switch (this.config.riskTolerance) {
      case 'conservative':
        // Only established protocols with high TVL
        return yields.filter(y => y.tvl > 10_000_000); // > $10M TVL
      
      case 'moderate':
        return yields.filter(y => y.tvl > 1_000_000); // > $1M TVL
      
      case 'aggressive':
        return yields; // Accept all
      
      default:
        return yields;
    }
  }

  /**
   * Find best yield from available options
   */
  protected findBestYield(
    yields: YieldData[],
    asset: string,
  ): YieldData | null {
    const filtered = yields.filter(y => 
      y.asset === asset && y.apy > 0
    );

    if (filtered.length === 0) return null;

    // Sort by APY descending
    const sorted = filtered.sort((a, b) => b.apy - a.apy);
    
    return sorted[0];
  }

  /**
   * Create a "hold" decision (no rebalancing)
   */
  protected createHoldDecision(reason: string): Decision {
    return {
      shouldRebalance: false,
      targetProtocol: null,
      expectedGainAPY: 0,
      gasCostUSD: 0,
      netBenefitAPY: 0,
      reasoning: reason,
      metadata: {
        strategy: this.constructor.name,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Create a "rebalance" decision
   */
  protected createRebalanceDecision(
    targetProtocol: string,
    targetProtocolAddress: string,
    expectedGainAPY: number,
    gasCostUSD: number,
    netBenefitAPY: number,
    reasoning: string,
    metadata: Record<string, any> = {},
  ): Decision {
    return {
      shouldRebalance: true,
      targetProtocol,
      targetProtocolAddress,
      expectedGainAPY,
      gasCostUSD,
      netBenefitAPY,
      reasoning,
      metadata: {
        strategy: this.constructor.name,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };
  }
}
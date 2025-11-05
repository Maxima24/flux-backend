import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseStrategy, type StrategyConfig } from './base-strategy';
import { GasCalculatorService } from '../calculators/gas-calculator.service';
import { ProfitCalculatorService } from '../calculators/profit-calculator.service';
import type { Decision, Position } from '../../../common/types/decision.types';
import type { YieldData } from '../../../common/types/yield.types';

@Injectable()
export class YieldOptimizerStrategy extends BaseStrategy {
  protected config: StrategyConfig = {
    minAPYImprovement: 2.0, // 2% minimum
    minRebalanceInterval: 6 * 3600, // 6 hours
    minProfitUSD: 5.0, // $5 minimum profit
    maxGasCostRatio: 0.1, // Gas can be max 10% of annual gain
    riskTolerance: 'moderate',
  };

  constructor(
    private readonly gasCalculator: GasCalculatorService,
    private readonly profitCalculator: ProfitCalculatorService,
    private readonly configService: ConfigService,
  ) {
    super(YieldOptimizerStrategy.name);

    // Allow config overrides
    const userConfig = this.configService.get('strategy.yieldOptimizer');
    if (userConfig) {
      this.config = { ...this.config, ...userConfig };
    }
  }

  async evaluate(
    position: Position,
    availableYields: YieldData[],
  ): Promise<Decision> {
    this.logger.log(`Evaluating position for vault ${position.vaultId}`);

    // Step 1: Check if we have data
    if (availableYields.length === 0) {
      return this.createHoldDecision('No yield data available');
    }

    // Step 2: Filter by risk tolerance
    const safeYields = this.filterByRisk(availableYields);
    if (safeYields.length === 0) {
      return this.createHoldDecision('No protocols meet risk criteria');
    }

    // Step 3: Find best yield
    const bestYield = this.findBestYield(safeYields, position.asset);
    if (!bestYield) {
      return this.createHoldDecision(`No yields found for ${position.asset}`);
    }

    // Step 4: Check if already in best position
    if (position.currentProtocol === bestYield.protocol) {
      return this.createHoldDecision(
        `Already in best position (${bestYield.protocol} @ ${bestYield.apy.toFixed(2)}%)`
      );
    }

    // Step 5: Calculate APY improvement
    const apyImprovement = bestYield.apy - position.currentAPY;
    if (apyImprovement < this.config.minAPYImprovement) {
      return this.createHoldDecision(
        `APY improvement ${apyImprovement.toFixed(2)}% below ${this.config.minAPYImprovement}% threshold`
      );
    }

    // Step 6: Check time since last rebalance
    if (!this.hasEnoughTimePassed(position)) {
      return this.createHoldDecision('Too soon since last rebalance');
    }

    // Step 7: Check gas price
    const isGasAcceptable = await this.gasCalculator.isGasPriceAcceptable();
    if (!isGasAcceptable) {
      return this.createHoldDecision('Gas price too high, waiting for better conditions');
    }

    // Step 8: Estimate gas cost
    const gasCost = await this.gasCalculator.estimateRebalanceGasCost(
      position.currentProtocol || '',
      bestYield.protocol,
      BigInt(Math.floor(position.amount * 1e6)), // Assuming USDC decimals
    );

    // Step 9: Calculate profitability
    const profitAnalysis = this.profitCalculator.calculateProfitability(
      position,
      bestYield.apy,
      gasCost,
      {
        minAPYImprovement: this.config.minAPYImprovement,
        minProfitUSD: this.config.minProfitUSD,
        maxGasCostRatio: this.config.maxGasCostRatio,
      },
    );

    // Step 10: Make final decision
    if (!profitAnalysis.isWorthwhile) {
      return this.createHoldDecision(profitAnalysis.reasoning);
    }

    // Step 11: Expected value check (30-day horizon)
    const expectedValue = this.profitCalculator.calculateExpectedValue(
      position.currentAPY,
      bestYield.apy,
      position.amount,
      gasCost.gasCostUSD,
      30, // 30-day horizon
    );

    if (expectedValue.recommendation === 'WAIT') {
      return this.createHoldDecision(
        `Expected value analysis suggests waiting (EV: $${expectedValue.waitAndHold.toFixed(2)} vs $${expectedValue.moveNow.toFixed(2)})`
      );
    }

    // GREEN LIGHT - Rebalance!
    return this.createRebalanceDecision(
      bestYield.protocol,
      '', // Will be filled by executor with actual strategy address
      profitAnalysis.apyImprovement,
      profitAnalysis.gasCostUSD,
      profitAnalysis.netBenefitAPY,
      profitAnalysis.reasoning,
      {
        currentAPY: position.currentAPY,
        targetAPY: bestYield.apy,
        breakEvenDays: profitAnalysis.breakEvenDays,
        roi: profitAnalysis.roi,
        gasEstimate: {
          units: gasCost.gasUnit.toString(),
          priceGwei: gasCost.gasPriceGwei,
        },
      },
    );
  }
}
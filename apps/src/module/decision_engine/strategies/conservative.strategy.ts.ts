import { Injectable } from '@nestjs/common';
import { BaseStrategy, type StrategyConfig } from './base-strategy';
import { GasCalculatorService } from '../calculators/gas-calculator.service';
import { ProfitCalculatorService } from '../calculators/profit-calculator.service';
import type { Decision, Position } from '../../../common/types/decision.types';
import type { YieldData } from '../../../common/types/yield.types';

@Injectable()
export class ConservativeStrategy extends BaseStrategy {
  protected config: StrategyConfig = {
    minAPYImprovement: 3.0, // 3% minimum (higher than optimizer)
    minRebalanceInterval: 24 * 3600, // 24 hours (longer wait)
    minProfitUSD: 10.0, // $10 minimum (higher threshold)
    maxGasCostRatio: 0.05, // Gas can be max 5% of annual gain (stricter)
    riskTolerance: 'conservative',
  };

  constructor(
    private readonly gasCalculator: GasCalculatorService,
    private readonly profitCalculator: ProfitCalculatorService,
  ) {
    super(ConservativeStrategy.name);
  }

  async evaluate(
    position: Position,
    availableYields: YieldData[],
  ): Promise<Decision> {
    this.logger.log(`Conservative evaluation for vault ${position.vaultId}`);

    // Use same logic as YieldOptimizer but with stricter thresholds
    // (Implementation similar to YieldOptimizerStrategy)
    
    // Additional conservative checks:
    
    // 1. Only move to protocols with proven track record
    const establishedProtocols = ['aave', 'compound'];
    const conservativeYields = availableYields.filter(y =>
      establishedProtocols.includes(y.protocol.toLowerCase())
    );

    if (conservativeYields.length === 0) {
      return this.createHoldDecision('No established protocols available');
    }

    // 2. Require longer break-even period to be acceptable
    // 3. Avoid moves during high volatility
    
    // ... rest of implementation similar to YieldOptimizer
    // but with this.config values which are more conservative
    
    return this.createHoldDecision('Conservative strategy: holding current position');
  }
}
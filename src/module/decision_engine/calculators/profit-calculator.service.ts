import { Injectable, Logger } from '@nestjs/common';
import type { Decision, Position } from '../../../common/types/decision.types';
import type { GasCostEstimate } from './gas-calculator.service';

export interface ProfitAnalysis {
  apyImprovement: number;
  annualGainUSD: number;
  dailyGainUSD: number;
  monthlyGainUSD: number;
  
  gasCostUSD: number;
  netAnnualGainUSD: number;
  netBenefitAPY: number;
  
  breakEvenDays: number;
  roi: number; // Return on investment (net gain / gas cost)
  
  isWorthwhile: boolean;
  reasoning: string;
}

@Injectable()
export class ProfitCalculatorService {
  private readonly logger = new Logger(ProfitCalculatorService.name);

  /**
   * Calculate complete profit analysis for a rebalancing decision
   */
  calculateProfitability(
    position: Position,
    targetAPY: number,
    gasCost: GasCostEstimate,
    thresholds: {
      minAPYImprovement: number;
      minProfitUSD: number;
      maxGasCostRatio: number; // Max % of annual gain that gas can be
    },
  ): ProfitAnalysis {
    const apyImprovement = targetAPY - position.currentAPY;
    const amount = position.amount;

    // Calculate gains
    const annualGainUSD = (apyImprovement / 100) * amount;
    const monthlyGainUSD = annualGainUSD / 12;
    const dailyGainUSD = annualGainUSD / 365;

    // Net calculations
    const gasCostUSD = gasCost.gasCostUSD;
    const netAnnualGainUSD = annualGainUSD - gasCostUSD;
    const netBenefitAPY = (netAnnualGainUSD / amount) * 100;

    // Break-even analysis
    const breakEvenDays = dailyGainUSD > 0 
      ? gasCostUSD / dailyGainUSD 
      : Infinity;

    // ROI calculation
    const roi = gasCostUSD > 0 ? netAnnualGainUSD / gasCostUSD : 0;

    // Decision logic
    let isWorthwhile = true;
    let reasoning = '';

    if (apyImprovement < thresholds.minAPYImprovement) {
      isWorthwhile = false;
      reasoning = `APY improvement ${apyImprovement.toFixed(2)}% below threshold ${thresholds.minAPYImprovement}%`;
    } else if (netAnnualGainUSD < thresholds.minProfitUSD) {
      isWorthwhile = false;
      reasoning = `Net annual gain $${netAnnualGainUSD.toFixed(2)} below minimum $${thresholds.minProfitUSD}`;
    } else if (gasCostUSD > annualGainUSD * thresholds.maxGasCostRatio) {
      isWorthwhile = false;
      const gasCostPercentage = (gasCostUSD / annualGainUSD * 100).toFixed(1);
      reasoning = `Gas cost ${gasCostPercentage}% of annual gain exceeds ${thresholds.maxGasCostRatio * 100}% threshold`;
    } else if (breakEvenDays > 30) {
      isWorthwhile = false;
      reasoning = `Break-even period ${Math.round(breakEvenDays)} days too long`;
    } else {
      reasoning = `Profitable move: ${apyImprovement.toFixed(2)}% APY gain, break-even in ${Math.round(breakEvenDays)} days`;
    }

    this.logger.debug(`Profit analysis: ${reasoning}`);

    return {
      apyImprovement,
      annualGainUSD,
      dailyGainUSD,
      monthlyGainUSD,
      gasCostUSD,
      netAnnualGainUSD,
      netBenefitAPY,
      breakEvenDays,
      roi,
      isWorthwhile,
      reasoning,
    };
  }

  /**
   * Calculate minimum amount needed to make rebalancing worthwhile
   */
  calculateMinimumViableAmount(
    apyImprovement: number,
    gasCostUSD: number,
    minBreakEvenDays: number = 7,
  ): number {
    // Daily gain needed = gas cost / break-even days
    const requiredDailyGain = gasCostUSD / minBreakEvenDays;
    
    // Annual gain needed = daily gain * 365
    const requiredAnnualGain = requiredDailyGain * 365;
    
    // Amount needed = annual gain / APY improvement
    const minAmount = (requiredAnnualGain / apyImprovement) * 100;
    
    return minAmount;
  }

  /**
   * Calculate expected value of waiting vs moving now
   */
  calculateExpectedValue(
    currentAPY: number,
    targetAPY: number,
    amount: number,
    gasCostUSD: number,
    daysToHold: number,
  ): {
    moveNow: number;
    waitAndHold: number;
    recommendation: 'MOVE_NOW' | 'WAIT';
  } {
    // Value if we move now
    const moveNowGain = ((targetAPY / 100) * amount * daysToHold) / 365;
    const moveNowValue = moveNowGain - gasCostUSD;

    // Value if we wait
    const waitAndHoldGain = ((currentAPY / 100) * amount * daysToHold) / 365;
    const waitAndHoldValue = waitAndHoldGain;

    return {
      moveNow: moveNowValue,
      waitAndHold: waitAndHoldValue,
      recommendation: moveNowValue > waitAndHoldValue ? 'MOVE_NOW' : 'WAIT',
    };
  }
}
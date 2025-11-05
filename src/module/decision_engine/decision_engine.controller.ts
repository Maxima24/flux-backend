import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DecisionEngineService } from './decision_engine.service';
import { DecisionRequestDto, EvaluatePositionDto } from './dto/decision-request.dto';

@Controller('decisions')
export class DecisionEngineController {
  constructor(
    private readonly decisionEngine: DecisionEngineService,
  ) {}

  /**
   * POST /decisions/evaluate/:vaultId
   * Evaluate a specific vault and return decision
   */
  @Post('evaluate/:vaultId')
  @HttpCode(HttpStatus.OK)
  async evaluateVault(
    @Param('vaultId') vaultId: string,
    @Body() dto?: DecisionRequestDto,
  ) {
    try {
      const decision = await this.decisionEngine.evaluateVault(vaultId);
      
      return {
        success: true,
        vaultId,
        decision: {
          shouldRebalance: decision.shouldRebalance,
          targetProtocol: decision.targetProtocol,
          currentState: {
            protocol: null, // Will be populated from vault
            apy: 0,
          },
          recommendation: decision.shouldRebalance ? {
            targetProtocol: decision.targetProtocol,
            expectedGainAPY: decision.expectedGainAPY,
          } : null,
          economics: decision.shouldRebalance ? {
            gasCostUSD: decision.gasCostUSD,
            netBenefitAPY: decision.netBenefitAPY,
          } : null,
          reasoning: decision.reasoning,
          metadata: decision.metadata,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /decisions/evaluate-all
   * Evaluate all active vaults
   */
  @Post('evaluate-all')
  @HttpCode(HttpStatus.OK)
  async evaluateAllVaults() {
    try {
      const decisions = await this.decisionEngine.evaluateAllVaults();
      
      const results = Array.from(decisions.entries()).map(([vaultId, decision]) => ({
        vaultId,
        shouldRebalance: decision.shouldRebalance,
        targetProtocol: decision.targetProtocol,
        reasoning: decision.reasoning,
      }));

      const rebalanceCount = results.filter(r => r.shouldRebalance).length;
      const holdCount = results.filter(r => !r.shouldRebalance).length;

      return {
        success: true,
        summary: {
          total: results.length,
          rebalance: rebalanceCount,
          hold: holdCount,
        },
        decisions: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/history/:vaultId
   * Get decision history for a vault
   */
  @Get('history/:vaultId')
  async getDecisionHistory(
    @Param('vaultId') vaultId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const historyLimit = limit ? parseInt(limit) : 50;
      
      if (historyLimit < 1 || historyLimit > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      const history = await this.decisionEngine.getDecisionHistory(vaultId, historyLimit);

      return {
        success: true,
        vaultId,
        count: history.length,
        decisions: history.map(d => ({
          id: d.id,
          type: d.decisionType,
          fromProtocol: d.fromProtocol?.name || null,
          toProtocol: d.toProtocol?.name || null,
          expectedGainAPY: Number(d.expectedGainApy),
          gasCostUSD: Number(d.estimatedGasCost),
          netBenefitAPY: Number(d.netBenefitApy),
          wasExecuted: d.wasExecuted,
          reasoning: d.reason,
          createdAt: d.createdAt,
          transactions: d.transactions.map(tx => ({
            hash: tx.txHash,
            status: tx.status,
            gasUsed: tx.gasUsed ? Number(tx.gasUsed) : null,
          })),
        })),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/pending
   * Get pending rebalance decisions (not yet executed)
   */
  @Get('pending')
  async getPendingRebalances() {
    try {
      const pending = await this.decisionEngine.getPendingRebalances();

      return {
        success: true,
        count: pending.length,
        decisions: pending.map(d => ({
          id: d.id,
          vaultId: d.vaultId,
          vaultAddress: d.vault.contractAddress,
          fromProtocol: d.vault.currentProtocol?.name || null,
          toProtocol: d.toProtocol?.name || null,
          amount: Number(d.amount),
          expectedGainAPY: Number(d.expectedGainApy),
          gasCostUSD: Number(d.estimatedGasCost),
          reasoning: d.reason,
          createdAt: d.createdAt,
          age: this.calculateAge(d.createdAt),
        })),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/stats
   * Get decision statistics (optionally filtered by vault)
   */
  @Get('stats')
  async getStats(@Query('vaultId') vaultId?: string) {
    try {
      const stats = await this.decisionEngine.getDecisionStats(vaultId);

      return {
        success: true,
        vaultId: vaultId || 'all',
        stats: {
          total: stats.total,
          breakdown: {
            rebalances: stats.rebalances,
            holds: stats.holds,
            pending: stats.pending,
          },
          execution: {
            executed: stats.executed,
            successRate: `${stats.successRate}%`,
          },
          efficiency: {
            holdRate: `${stats.holdRate}%`,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/performance/:vaultId
   * Get theoretical performance analysis for a vault
   */
  @Get('performance/:vaultId')
  async getPerformance(
    @Param('vaultId') vaultId: string,
    @Query('days') days?: string,
  ) {
    try {
      const period = days ? parseInt(days) : 30;
      
      if (period < 1 || period > 365) {
        throw new BadRequestException('Days must be between 1 and 365');
      }

      const performance = await this.decisionEngine.calculateTheoreticalPerformance(
        vaultId,
        period,
      );

      return {
        success: true,
        vaultId,
        performance: {
          period: performance.period,
          summary: {
            totalDecisions: performance.totalDecisions,
            rebalancesExecuted: performance.rebalancesExecuted,
          },
          gains: {
            totalExpectedAPY: `${performance.totalExpectedGainAPY}%`,
            totalGasCost: `$${performance.totalGasCostUSD}`,
            netGainAPY: `${performance.netGainAPY}%`,
          },
          metrics: {
            averageGainPerMove: `${performance.averageGainPerMove}%`,
            efficiency: `${performance.efficiency}%`,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/latest/:vaultId
   * Get the most recent decision for a vault
   */
  @Get('latest/:vaultId')
  async getLatestDecision(@Param('vaultId') vaultId: string) {
    try {
      const decision = await this.decisionEngine.getLatestDecision(vaultId);

      if (!decision) {
        return {
          success: false,
          message: 'No decisions found for this vault',
        };
      }

      return {
        success: true,
        vaultId,
        decision: {
          id: decision.id,
          type: decision.decisionType,
          fromProtocol: decision.fromProtocol?.name || null,
          toProtocol: decision.toProtocol?.name || null,
          expectedGainAPY: Number(decision.expectedGainApy),
          gasCostUSD: Number(decision.estimatedGasCost),
          netBenefitAPY: Number(decision.netBenefitApy),
          wasExecuted: decision.wasExecuted,
          reasoning: decision.reason,
          createdAt: decision.createdAt,
          age: this.calculateAge(decision.createdAt),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /decisions/:decisionId/cancel
   * Cancel a pending decision
   */
  @Post(':decisionId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelDecision(@Param('decisionId') decisionId: string) {
    try {
      await this.decisionEngine.cancelDecision(decisionId);

      return {
        success: true,
        message: 'Decision cancelled successfully',
        decisionId,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /decisions/:decisionId/mark-executed
   * Mark a decision as executed (used by executor)
   */
  @Post(':decisionId/mark-executed')
  @HttpCode(HttpStatus.OK)
  async markExecuted(@Param('decisionId') decisionId: string) {
    try {
      await this.decisionEngine.markDecisionExecuted(decisionId);

      return {
        success: true,
        message: 'Decision marked as executed',
        decisionId,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * GET /decisions/strategies
   * Get list of available strategies
   */
  @Get('strategies')
  getStrategies() {
    const strategies = this.decisionEngine.getAvailableStrategies();

    return {
      success: true,
      strategies: strategies.map(name => ({
        name,
        description: this.getStrategyDescription(name),
      })),
    };
  }

  /**
   * GET /decisions/health
   * Decision engine health check
   */
  @Get('health')
  async healthCheck() {
    try {
      const health = await this.decisionEngine.healthCheck();

      return {
        success: true,
        ...health,
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private calculateAge(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ago`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
    return `${seconds}s ago`;
  }

  private getStrategyDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'yield-optimizer': 'Aggressive strategy that maximizes APY gains with moderate risk tolerance',
      'conservative': 'Conservative strategy with higher thresholds and longer rebalance intervals',
    };
    return descriptions[name] || 'No description available';
  }
}
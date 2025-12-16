import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { YieldScannerService } from './yield-scanner.service';

@Controller('yields')
export class YieldScannerController {
  constructor(private readonly yieldScanner: YieldScannerService) {}

  /**
   * GET /yields?asset=USDC
   * Get all current yields for an asset
   */
  @Get()
  async getAllYields(@Query('asset') asset: string = 'USDC') {
    const yields = await this.yieldScanner.getAllYields(asset);
    
    return {
      success: true,
      asset,
      count: yields.length,
      yields,
    };
  }

  /**
   * GET /yields/best?asset=USDC
   * Get best yield for an asset
   */
  @Get('best')
  async getBestYield(@Query('asset') asset: string = 'USDC') {
    const bestYield = await this.yieldScanner.getBestYield(asset);
    
    if (!bestYield) {
      return {
        success: false,
        message: `No yields available for ${asset}`,
      };
    }

    return {
      success: true,
      asset,
      bestYield,
    };
  }

  /**
   * GET /yields/protocol/:protocol?asset=USDC
   * Get yield for specific protocol
   */
  @Get('protocol/:protocol')
  async getProtocolYield(
    @Param('protocol') protocol: string,
    @Query('asset') asset: string = 'USDC',
  ) {
    const yield_data = await this.yieldScanner.getProtocolYield(protocol, asset);
    
    if (!yield_data) {
      return {
        success: false,
        message: `No yield data for ${protocol}/${asset}`,
      };
    }

    return {
      success: true,
      protocol,
      asset,
      yield: yield_data,
    };
  }

  /**
   * POST /yields/scan?asset=USDC
   * Force refresh yields
   */
  @Post('scan')
  async forceScan(@Query('asset') asset: string = 'USDC') {
    const yields = await this.yieldScanner.forceRefresh(asset);
    
    return {
      success: true,
      asset,
      count: yields.length,
      yields,
    };
  }

  /**
   * GET /yields/history/:protocol?asset=USDC&days=7
   * Get historical yield data
   */
  @Get('history/:protocol')
  async getHistory(
    @Param('protocol') protocol: string,
    @Query('asset') asset: string = 'USDC',
    @Query('days') days: string = '7',
  ) {
    const history = await this.yieldScanner.getYieldHistory(
      protocol,
      asset,
      parseInt(days),
    );
    
    return {
      success: true,
      protocol,
      asset,
      period: `${days} days`,
      count: history.length,
      history,
    };
  }

  /**
   * GET /yields/health
   * Health check
   */
  @Get('health')
  async healthCheck() {
    const health = await this.yieldScanner.healthCheck();
    
    return {
      success: true,
      ...health,
    };
  }
}
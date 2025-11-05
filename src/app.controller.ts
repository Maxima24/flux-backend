import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /api
   * Root endpoint - API information
   */
  @Get()
  getRoot() {
    return {
      name: 'Flux API',
      description: 'AI Agent Orchestration Platform for DeFi Yield Optimization',
      version: '1.0.0',
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
      chain: process.env.CHAIN_ID === '137' ? 'Polygon Mainnet' : 'Mumbai Testnet',
      timestamp: new Date().toISOString(),
      endpoints: {
        root: '/api',
        health: '/api/health',
        yields: '/api/yields',
        decisions: '/api/decisions',
      },
    };
  }

  /**
   * GET /api/health
   * Comprehensive health check for all services
   */
  @Get('health')
  async getHealth() {
    const health = await this.appService.getHealthCheck();
    return health;
  }

  /**
   * GET /api/status
   * Quick status check (lightweight)
   */
  @Get('status')
  getStatus() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    };
  }
}
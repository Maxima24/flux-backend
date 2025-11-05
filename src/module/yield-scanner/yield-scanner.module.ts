import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { YieldScannerService } from './yield-scanner.service';
import { YieldScannerController } from './yield-scanner.controller';
import { AaveProvider } from '../providers/aave.provider';
import { QuickswapProvider } from '../providers/quickswap.provider';
import { DeFiLlamaProvider } from '../providers/defillama.provider';
import { BlockchainModule } from '../blockchain/blockchain.module'
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    BlockchainModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('database.redis.host'),
        port: config.get('database.redis.port'),
        password: config.get('database.redis.password'),
        ttl: config.get('database.cacheTTL.yields'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [YieldScannerController],
  providers: [
    YieldScannerService,
    AaveProvider,
    QuickswapProvider,
    DeFiLlamaProvider,
  ],
  exports: [YieldScannerService],
})
export class YieldScannerModule {}
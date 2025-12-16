import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Configuration
import blockchainConfig from './config/blockchain.config';
import databaseConfig from './config/database.config';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { YieldScannerModule } from './modules/yield-scanner/yield-scanner.module';
import { DecisionEngineModule } from './modules/decision-engine/decision-engine.module';

// Root Controllers & Services
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ============================================
    // CONFIGURATION
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [blockchainConfig, databaseConfig],
    }),

    // ============================================
    // SCHEDULING (for cron jobs)
    // ============================================
    ScheduleModule.forRoot(),

    // ============================================
    // QUEUE SYSTEM (BullMQ for background jobs)
    // ============================================
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),

    // ============================================
    // DATABASE
    // ============================================
    PrismaModule,

    // ============================================
    // CORE MODULES
    // ============================================
    BlockchainModule,
    YieldScannerModule,
    DecisionEngineModule,
    
    // TODO: Add these modules next
    // ExecutorModule,
    // VaultModule,
    // AgentModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
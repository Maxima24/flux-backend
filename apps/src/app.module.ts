import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';


// Root Controllers & Services
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './module/prisma/prisma.module';

@Module({
  imports: [
    // ============================================
    // DATABASE
    // ============================================
    PrismaModule,

    // ============================================
    // CORE MODULES
    // ============================================
 
    // TODO: Add these modules next
    // ExecutorModule,
    // VaultModule,
    // AgentModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
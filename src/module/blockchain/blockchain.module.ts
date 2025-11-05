import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { VaultContract } from './contracts/vault.contract';
import { StrategyContract } from './contracts/strategy.contract';
import blockchainConfig from '../../config/blockchain.config';

@Module({
  imports: [ConfigModule.forFeature(blockchainConfig)],
  controllers: [BlockchainController],
  providers: [
    BlockchainService,
    VaultContract,
    StrategyContract,
  ],
  exports: [BlockchainService, VaultContract, StrategyContract],
})
export class BlockchainModule {}
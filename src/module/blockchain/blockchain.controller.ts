import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { formatUnits } from 'viem';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchain: BlockchainService) {}

  /**
   * GET /blockchain/info
   * Get blockchain connection info
   */
  @Get('info')
  async getInfo() {
    const chain = this.blockchain.getChain();
    const operatorAddress = this.blockchain.getOperatorAddress();
    const [blockNumber, gasPrice, operatorBalance] = await Promise.all([
      this.blockchain.getCurrentBlockNumber(),
      this.blockchain.getGasPrice(),
      this.blockchain.getBalance(operatorAddress),
    ]);

    return {
      success: true,
      chain: {
        name: chain.name,
        id: chain.id,
        nativeCurrency: chain.nativeCurrency,
      },
      operator: {
        address: operatorAddress,
        balance: formatUnits(operatorBalance, 18),
        balanceUnit: 'MATIC',
      },
      network: {
        blockNumber: blockNumber.toString(),
        gasPrice: `${Number(gasPrice) / 1e9} gwei`,
      },
    };
  }

  /**
   * GET /blockchain/health
   * Blockchain health check
   */
  @Get('health')
  async getHealth() {
    const health = await this.blockchain.healthCheck();
    
    return {
      success: health.connected,
      ...health,
      blockNumber: health.blockNumber.toString(),
      gasPrice: `${Number(health.gasPrice) / 1e9} gwei`,
      operatorBalance: formatUnits(health.operatorBalance, 18),
      operatorBalanceUSD: `$${health.operatorBalanceUSD.toFixed(2)}`,
    };
  }

  /**
   * GET /blockchain/gas-price
   * Get current gas price
   */
  @Get('gas-price')
  async getGasPrice() {
    const gasPrice = await this.blockchain.getGasPrice();
    const isAcceptable = await this.blockchain.isGasPriceAcceptable();

    return {
      success: true,
      gasPrice: Number(gasPrice),
      gasPriceGwei: Number(gasPrice) / 1e9,
      isAcceptable,
    };
  }

  /**
   * GET /blockchain/transaction/:hash
   * Get transaction details
   */
  @Get('transaction/:hash')
  async getTransaction(@Param('hash') hash: string) {
    try {
      const [tx, receipt] = await Promise.all([
        this.blockchain.getTransaction(hash as `0x${string}`),
        this.blockchain.getTransactionReceipt(hash as `0x${string}`).catch(() => null),
      ]);

      return {
        success: true,
        transaction: tx,
        receipt,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * GET /blockchain/token/:address/balance
   * Get token balance for operator
   */
  @Get('token/:address/balance')
  async getTokenBalance(
    @Param('address') address: string,
    @Query('holder') holder?: string,
  ) {
    const holderAddress = (holder || this.blockchain.getOperatorAddress()) as `0x${string}`;
    
    try {
      const [balance, decimals, symbol] = await Promise.all([
        this.blockchain.getTokenBalance(address as `0x${string}`, holderAddress),
        this.blockchain.getTokenDecimals(address as `0x${string}`),
        this.blockchain.getTokenSymbol(address as `0x${string}`),
      ]);

      return {
        success: true,
        token: {
          address,
          symbol,
          decimals,
        },
        holder: holderAddress,
        balance: balance.toString(),
        balanceFormatted: formatUnits(balance, decimals),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * GET /blockchain/price/:symbol
   * Get token price in USD
   */
  @Get('price/:symbol')
  async getTokenPrice(@Param('symbol') symbol: string) {
    const price = await this.blockchain.getTokenPrice(symbol);
    
    return {
      success: true,
      symbol: symbol.toUpperCase(),
      priceUSD: price,
    };
  }

  /**
   * GET /blockchain/contract/:address/check
   * Check if contract is deployed
   */
  @Get('contract/:address/check')
  async checkContract(@Param('address') address: string) {
    const isDeployed = await this.blockchain.isContractDeployed(address as `0x${string}`);
    
    return {
      success: true,
      address,
      isDeployed,
    };
  }
}
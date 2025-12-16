import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
  type TransactionReceipt,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Chain } from 'viem/chains';

export interface GasEstimate {
  gas: bigint;
  gasPrice: bigint;
  totalCost: bigint;
  totalCostUSD: number;
}

export interface TransactionResult {
  hash: Hash;
  status: 'pending' | 'success' | 'failed';
  gasUsed?: bigint;
  blockNumber?: bigint;
  receipt?: TransactionReceipt;
}

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  
  private publicClient: PublicClient;
  private walletClient: WalletClient;
  private operatorAccount: ReturnType<typeof privateKeyToAccount>;
  
  private chain: Chain;
  private rpcUrl: string;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.chain = this.config.get<Chain>('blockchain.chain');
    this.rpcUrl = this.config.get<string>('blockchain.rpcUrl');
    const privateKey = this.config.get<string>('blockchain.operatorPrivateKey');

    if (!privateKey) {
      this.logger.error('OPERATOR_PRIVATE_KEY not configured!');
      throw new Error('OPERATOR_PRIVATE_KEY is required');
    }

    if (!this.rpcUrl) {
      this.logger.error('RPC_URL not configured!');
      throw new Error('RPC_URL is required');
    }

    try {
      // Initialize operator account
      this.operatorAccount = privateKeyToAccount(privateKey as `0x${string}`);

      // Public client (for reading blockchain data)
      this.publicClient = createPublicClient({
        chain: this.chain,
        transport: http(this.rpcUrl),
      });

      // Wallet client (for writing transactions)
      this.walletClient = createWalletClient({
        account: this.operatorAccount,
        chain: this.chain,
        transport: http(this.rpcUrl),
      });

      // Verify connection
      const blockNumber = await this.publicClient.getBlockNumber();
      const balance = await this.getBalance(this.operatorAccount.address);

      this.logger.log('✅ Blockchain service initialized');
      this.logger.log(`Chain: ${this.chain.name} (ID: ${this.chain.id})`);
      this.logger.log(`Operator: ${this.operatorAccount.address}`);
      this.logger.log(`Block: ${blockNumber}`);
      this.logger.log(`Balance: ${formatUnits(balance, 18)} MATIC`);

      // Warn if balance is low
      if (balance < parseUnits('0.1', 18)) {
        this.logger.warn('⚠️  Operator balance is low! Please top up.');
      }
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // ============================================
  // GETTERS
  // ============================================

  getPublicClient(): PublicClient {
    return this.publicClient;
  }

  getWalletClient(): WalletClient {
    return this.walletClient;
  }

  getOperatorAddress(): Address {
    return this.operatorAccount.address;
  }

  getChain(): Chain {
    return this.chain;
  }

  // ============================================
  // BLOCKCHAIN INFO
  // ============================================

  async getBalance(address: Address): Promise<bigint> {
    try {
      return await this.publicClient.getBalance({ address });
    } catch (error) {
      this.logger.error(`Failed to get balance for ${address}:`, error);
      throw error;
    }
  }

  async getCurrentBlockNumber(): Promise<bigint> {
    try {
      return await this.publicClient.getBlockNumber();
    } catch (error) {
      this.logger.error('Failed to get block number:', error);
      throw error;
    }
  }

  async getGasPrice(): Promise<bigint> {
    try {
      return await this.publicClient.getGasPrice();
    } catch (error) {
      this.logger.error('Failed to get gas price:', error);
      throw error;
    }
  }

  async getTransaction(hash: Hash): Promise<any> {
    try {
      return await this.publicClient.getTransaction({ hash });
    } catch (error) {
      this.logger.error(`Failed to get transaction ${hash}:`, error);
      throw error;
    }
  }

  async getTransactionReceipt(hash: Hash): Promise<TransactionReceipt> {
    try {
      return await this.publicClient.getTransactionReceipt({ hash });
    } catch (error) {
      this.logger.error(`Failed to get receipt for ${hash}:`, error);
      throw error;
    }
  }

  // ============================================
  // CONTRACT READING
  // ============================================

  async readContract<T = any>(params: {
    address: Address;
    abi: any[];
    functionName: string;
    args?: any[];
  }): Promise<T> {
    try {
      const result = await this.publicClient.readContract({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args || [],
      });

      this.logger.debug(
        `Read ${params.address}.${params.functionName}() = ${JSON.stringify(result)}`
      );

      return result as T;
    } catch (error) {
      this.logger.error(
        `Failed to read ${params.address}.${params.functionName}():`,
        error
      );
      throw error;
    }
  }

  async multicall(calls: Array<{
    address: Address;
    abi: any[];
    functionName: string;
    args?: any[];
  }>): Promise<any[]> {
    try {
      const results = await Promise.all(
        calls.map(call => this.readContract(call))
      );
      return results;
    } catch (error) {
      this.logger.error('Multicall failed:', error);
      throw error;
    }
  }

  // ============================================
  // CONTRACT WRITING
  // ============================================

  async writeContract(params: {
    address: Address;
    abi: any[];
    functionName: string;
    args?: any[];
    value?: bigint;
  }): Promise<Hash> {
    try {
      this.logger.log(
        `Writing ${params.address}.${params.functionName}(${JSON.stringify(params.args || [])})`
      );

      // Simulate first to catch errors
      const { request } = await this.publicClient.simulateContract({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args || [],
        value: params.value,
        account: this.operatorAccount,
      });

      // Execute
      const hash = await this.walletClient.writeContract(request);

      this.logger.log(`Transaction sent: ${hash}`);
      return hash;
    } catch (error) {
      this.logger.error(
        `Failed to write ${params.address}.${params.functionName}():`,
        error
      );
      throw error;
    }
  }

  async writeContractWithConfirmation(
    params: {
      address: Address;
      abi: any[];
      functionName: string;
      args?: any[];
      value?: bigint;
    },
    confirmations: number = 2
  ): Promise<TransactionResult> {
    try {
      const hash = await this.writeContract(params);
      
      this.logger.log(`Waiting for ${confirmations} confirmations...`);
      const receipt = await this.waitForTransaction(hash, confirmations);

      const result: TransactionResult = {
        hash,
        status: receipt.status === 'success' ? 'success' : 'failed',
        gasUsed: receipt.gasUsed,
        blockNumber: receipt.blockNumber,
        receipt,
      };

      if (result.status === 'success') {
        this.logger.log(`✅ Transaction confirmed: ${hash}`);
      } else {
        this.logger.error(`❌ Transaction failed: ${hash}`);
      }

      return result;
    } catch (error) {
      this.logger.error('Transaction failed:', error);
      return {
        hash: '0x' as Hash,
        status: 'failed',
      };
    }
  }

  async waitForTransaction(
    hash: Hash,
    confirmations: number = 2
  ): Promise<TransactionReceipt> {
    try {
      return await this.publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
        timeout: 120_000, // 2 minutes
      });
    } catch (error) {
      this.logger.error(`Failed to wait for transaction ${hash}:`, error);
      throw error;
    }
  }

  // ============================================
  // GAS ESTIMATION
  // ============================================

  async estimateGas(params: {
    address: Address;
    abi: any[];
    functionName: string;
    args?: any[];
    value?: bigint;
  }): Promise<GasEstimate> {
    try {
      const gas = await this.publicClient.estimateContractGas({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args || [],
        value: params.value,
        account: this.operatorAccount,
      });

      const gasPrice = await this.getGasPrice();
      const gasBuffer = this.config.get<number>('blockchain.gasBuffer', 1.5);
      
      const bufferedGas = BigInt(Math.floor(Number(gas) * gasBuffer));
      const totalCost = bufferedGas * gasPrice;

      // Get MATIC price in USD
      const maticPriceUSD = await this.getMaticPrice();
      const totalCostMATIC = Number(totalCost) / 1e18;
      const totalCostUSD = totalCostMATIC * maticPriceUSD;

      this.logger.debug(
        `Gas estimate: ${bufferedGas} units @ ${Number(gasPrice) / 1e9} gwei = $${totalCostUSD.toFixed(4)}`
      );

      return {
        gas: bufferedGas,
        gasPrice,
        totalCost,
        totalCostUSD,
      };
    } catch (error) {
      this.logger.error('Gas estimation failed:', error);
      throw error;
    }
  }

  async isGasPriceAcceptable(): Promise<boolean> {
    try {
      const gasPrice = await this.getGasPrice();
      const gasPriceGwei = Number(gasPrice) / 1e9;

      const minGasPrice = this.config.get<number>('blockchain.minGasPrice', 30);
      const maxGasPrice = this.config.get<number>('blockchain.maxGasPrice', 500);

      const acceptable = gasPriceGwei >= minGasPrice && gasPriceGwei <= maxGasPrice;

      if (!acceptable) {
        this.logger.warn(
          `Gas price ${gasPriceGwei.toFixed(2)} gwei outside acceptable range [${minGasPrice}, ${maxGasPrice}]`
        );
      }

      return acceptable;
    } catch (error) {
      this.logger.error('Failed to check gas price:', error);
      return false;
    }
  }

  // ============================================
  // TOKEN UTILITIES
  // ============================================

  async getTokenBalance(
    tokenAddress: Address,
    holderAddress: Address
  ): Promise<bigint> {
    const ERC20_ABI = [
      {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    return this.readContract<bigint>({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [holderAddress],
    });
  }

  async getTokenDecimals(tokenAddress: Address): Promise<number> {
    const ERC20_ABI = [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    return this.readContract<number>({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
  }

  async getTokenSymbol(tokenAddress: Address): Promise<string> {
    const ERC20_ABI = [
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    return this.readContract<string>({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'symbol',
    });
  }

  async approveToken(
    tokenAddress: Address,
    spenderAddress: Address,
    amount: bigint
  ): Promise<Hash> {
    const ERC20_ABI = [
      {
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    return this.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amount],
    });
  }

  // ============================================
  // FORMATTING UTILITIES
  // ============================================

  parseUnits(value: string, decimals: number): bigint {
    return parseUnits(value, decimals);
  }

  formatUnits(value: bigint, decimals: number): string {
    return formatUnits(value, decimals);
  }

  // ============================================
  // PRICE FEEDS
  // ============================================

  private async getMaticPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data['matic-network']?.usd || 0.75; // Fallback
    } catch (error) {
      this.logger.warn('Failed to fetch MATIC price, using fallback:', error.message);
      return 0.75; // Conservative fallback
    }
  }

  async getTokenPrice(symbol: string): Promise<number> {
    const coinGeckoIds: Record<string, string> = {
      MATIC: 'matic-network',
      USDC: 'usd-coin',
      USDT: 'tether',
      ETH: 'ethereum',
      WETH: 'ethereum',
      WBTC: 'wrapped-bitcoin',
    };

    const id = coinGeckoIds[symbol.toUpperCase()];
    if (!id) {
      this.logger.warn(`Unknown token symbol: ${symbol}`);
      return 0;
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data[id]?.usd || 0;
    } catch (error) {
      this.logger.error(`Failed to fetch ${symbol} price:`, error);
      return 0;
    }
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  async healthCheck(): Promise<{
    connected: boolean;
    blockNumber: bigint;
    gasPrice: bigint;
    operatorBalance: bigint;
    operatorBalanceUSD: number;
  }> {
    try {
      const [blockNumber, gasPrice, operatorBalance] = await Promise.all([
        this.getCurrentBlockNumber(),
        this.getGasPrice(),
        this.getBalance(this.operatorAccount.address),
      ]);

      const maticPrice = await this.getMaticPrice();
      const operatorBalanceMATIC = Number(operatorBalance) / 1e18;
      const operatorBalanceUSD = operatorBalanceMATIC * maticPrice;

      return {
        connected: true,
        blockNumber,
        gasPrice,
        operatorBalance,
        operatorBalanceUSD,
      };
    } catch (error) {
      this.logger.error('Blockchain health check failed:', error);
      return {
        connected: false,
        blockNumber: 0n,
        gasPrice: 0n,
        operatorBalance: 0n,
        operatorBalanceUSD: 0,
      };
    }
  }

  // ============================================
  // MONITORING
  // ============================================

  async checkOperatorBalance(minBalanceMATIC: number = 0.1): Promise<boolean> {
    try {
      const balance = await this.getBalance(this.operatorAccount.address);
      const balanceMATIC = Number(balance) / 1e18;

      if (balanceMATIC < minBalanceMATIC) {
        this.logger.warn(
          `⚠️  Operator balance low: ${balanceMATIC.toFixed(4)} MATIC (min: ${minBalanceMATIC})`
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to check operator balance:', error);
      return false;
    }
  }

  async isContractDeployed(address: Address): Promise<boolean> {
    try {
      const code = await this.publicClient.getBytecode({ address });
      return code !== undefined && code !== '0x';
    } catch (error) {
      this.logger.error(`Failed to check contract at ${address}:`, error);
      return false;
    }
  }
}
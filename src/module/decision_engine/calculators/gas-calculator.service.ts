import { Injectable,Logger } from "@nestjs/common";
import { Address } from 'viem';
// 
import {ConfigService} from "@nestjs/config"
import {BlockChainService} from '../../blockchain/blockchain.service'

// import {BlockChainServ}
import { GasCostEstimate } from './gas-calculator.service';


export interface GasCostEstimate{
    gasUnit:bigint
,
gasPriceGwei:number,
gasCostUSD:number,
gasCostMATIC:number,
breakDown:{
    withDraw:bigint,
    deposit:bigint,
    approve:bigint
}
}
@Injectable()
export class GasCalculatorService{
    private readonly logger = new Logger(GasCalculatorService.name)
    private readonly GAS_ESTIMATES ={
        WITHDRAW:150_000n,
        DEPOSIT:150_00n,
        APPROVE:50_000n
    }
    constructor(
        private readonly config:ConfigService,
        private readonly blockchain:BlockChainService
    ){}

    /**
     * Estimate the gas cost for a rebalance operation
     */
    async estimateRebalanceGasCost(
        fromProtocol:string,
        toProtocol:string,
        amount:bigint,

    ):Promise<GasCostEstimate>{
            try{
                const gasPrice = this.blockchain.getGasPrice()
                const gasPriceGwei = Number(gasPrice)/1e9
                //calculate total gas price
                const totalGas=this.GAS_ESTIMATES.WITHDRAW+this.GAS_ESTIMATES.DEPOSIT+this.GAS_ESTIMATES.APPROVE
                /**APPLY GAS BUFFER */
                //with a defualt buffer of 1.5x
                const gasBuffer = this.config.get<number>("blockchain.gasBuffer",1.5)
                const bufferedGas = BigInt(Math.floor(Number(totalGas)*gasBuffer))
                //calculate the cost in wei and matic
                const gasCostWei = bufferedGas*gasPrice
                const gasCostMATIC = (Number(gasPriceGwei)*Number(totalGas))/1e18
                //get the matic price in USD
                const maticPriceUSD = await this.blockchain.getMaticPriceUSD()  
                const gasCostUSD = gasCostMATIC*maticPriceUSD
                //log to the console the current price 
                this.logger.debug(`Gas estimates:${bufferedGas} units @ ${gasPriceGwei.toFixed(2)} gwei= $${gasCostUSD.toFixed(4)}`)
                return {
                    gasUnit:bufferedGas,
                    gasPriceGwei,
                    gasCostMATIC,
                    gasCostUSD,
                    breakDown:{
                        withDraw:this.GAS_ESTIMATES.WITHDRAW,
                        deposit:this.GAS_ESTIMATES.DEPOSIT,
                        approve:this.GAS_ESTIMATES.APPROVE



                    }


                }
            }catch(err){
                this.logger.error("Failed to estimate gas cost",err)

                return {
        gasUnit: 400_000n,
        gasPriceGwei: 50,
        gasCostMATIC: 0.02,
        gasCostUSD: 0.015, // Assume $0.75 MATIC
        breakDown: {
          withDraw: this.GAS_ESTIMATES.WITHDRAW,
          deposit: this.GAS_ESTIMATES.DEPOSIT,
          approve: this.GAS_ESTIMATES.APPROVE,
        },

            }
    }
}
/**Estimate gas fee for specific vault contract call */
    async estimateVaultRebalance(vaultAddress:Address,targetStrategy:Address,abi:any[]):Promise<GasCostEstimate>{
try{
    const estimate = await this.blockchain.estimateGas({
        address:vaultAddress,abi,functionName:"rebalance",
        args:[targetStrategy]
    })
    const maticPriceUSD = await this.getMaticPrice()
    const gasCostMATIC = Number(estimate.totalCost)/1e18
    const gasCostUSD =gasCostMATIC*maticPriceUSD
    return {
        gasUnit:estimate.gas,
        gasPriceGwei:Number(estimate.gasPrice)/1e9,
        gasCostMATIC,
        gasCostUSD,
        breakDown:{
            withDraw:0n,
            approve:0n,deposit:0n
        }
    }
    }catch(error){
        this.logger.error("Failed to estimate value rebalance gas:", error)
        throw error
    }
}
/**
 * Get Current Matic price in Usd
 */
     private async getMaticPrice(): Promise<number> {
    try {
      // Option 1: Use CoinGecko API (free tier)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd'
      );
      const data = await response.json();
      return data['matic-network']?.usd || 0.75; // Fallback to $0.75
    } catch (error) {
      this.logger.warn('Failed to fetch MATIC price, using fallback');
      return 0.75; // Conservative fallback
    }
  }
  /**
   * Check if the gas price is within the acceptable range
   */
  async isGasPriceAcceptable(): Promise<boolean> {
    const gasPrice = await this.blockchain.getGasPrice();
    const gasPriceGwei = Number(gasPrice) / 1e9;

    const minGasPrice = this.config.get<number>('blockchain.minGasPrice', 30);
    const maxGasPrice = this.config.get<number>('blockchain.maxGasPrice', 500);

    const acceptable = gasPriceGwei >= minGasPrice && gasPriceGwei <= maxGasPrice;

    if (!acceptable) {
      this.logger.warn(
        `Gas price ${gasPriceGwei} gwei is outside acceptable range [${minGasPrice}, ${maxGasPrice}]`
      );
    }

    return acceptable;
  }
}
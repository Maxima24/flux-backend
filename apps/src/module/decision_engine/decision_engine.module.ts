import { Module } from "@nestjs/common";
import { DecisionEngineService } from "./decision_engine.service";
import { DecisionEngineController } from "./decision_engine.controller";
import { YieldOptimizerStrategy } from './strategies/yield-optimizer.strategy';
import { ConservativeStrategy } from './strategies/conservative.strategy';
import { GasCalculatorService } from './calculators/gas-calculator.service';
import { ProfitCalculatorService } from './calculators/profit-calculator.service';

@module({
    imports:[
      
    ],
    controllers:[DecisionEngineController,

    ],
    providers:[DecisionEngineService, YieldOptimizerStrategy,
        ConservativeStrategy, GasCalculatorService, ProfitCalculatorService],
    exports:[DecisionEngineService]

}
)
export class DecisionEngineModule{}
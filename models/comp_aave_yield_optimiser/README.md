# COMP-AAVE YIELD OPTIMISER

A mathematical model for determining optimal liquidity allocation between Compound and Aave protocols to maximize yield (APY).

## Objective

The model maximizes the aggregate yield function:

**Y = APR(x)**

where:
```
APR(x) = [(A + x)U(x) + (C + (W - x))K(W - x)] / (A + C + W)
```

## Parameters

| Symbol | Description |
|--------|-------------|
| **A** | Current asset balance on Aave |
| **C** | Current asset balance on Compound |
| **W** | Unutilized amount to be allocated between Aave and Compound |
| **x** | Amount to supply to Aave (decision variable) |
| **W - x** | Amount to supply to Compound |

## Functions

- **U(x)**: Expected Earn APY at time *n + 1* from supplying *x* assets to Aave at time *n*
- **K(W - x)**: Expected Earn APY at time *n + 1* from supplying *(W - x)* assets to Compound at time *n*

## How It Works

The optimizer calculates the value of **x** that maximizes the weighted average APY across both protocols, considering:

1. Existing liquidity positions (A and C)
2. New capital to deploy (W)
3. Protocol-specific APY dynamics based on utilization rates
  
  

       
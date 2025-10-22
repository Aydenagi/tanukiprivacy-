
---

### docs/05-Exchanges-EVM.md
```md
# EVM Exchange Adapter (BSC/Astar)

Hermes uses **UniswapV2-compatible routers**.

## Flow
- `getQuote()` → `getAmountsOut(amountIn, path)`
- `swap()` → `swapExactTokensForTokens(...)`
- Automatically checks **allowance** and sends `approve()` if needed.

```mermaid
sequenceDiagram
  participant Strat as Strategy
  participant Evm as EvmExchange
  participant ERC20 as Base Token
  participant R as UniV2 Router

  Strat->>Evm: getQuote()
  Evm->>R: getAmountsOut(in, path)
  R-->>Evm: amounts[]

  Strat->>Evm: swap()
  Evm->>ERC20: allowance(owner, router)
  alt allowance < needed
    Evm->>ERC20: approve(router, amountIn)
  end
  Evm->>R: swapExactTokensForTokens(...)
  R-->>Evm: tx receipt

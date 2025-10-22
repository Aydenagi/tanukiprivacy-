# Solana Exchange Adapter

Hermes uses **Jupiter** for quotes and swap building.

## Flow
1. `getQuote()` → `/v6/quote` (finds route with `inAmount`, `outAmount`)
2. `swap()` → `/v6/swap`, signs returned transaction with your `SOLANA_KEYPAIR`
3. Submit via `sendTransaction`.

```mermaid
sequenceDiagram
  participant Strat as Strategy
  participant Sol as SolanaExchange
  participant Jup as Jupiter API
  participant Net as Solana RPC

  Strat->>Sol: getQuote()
  Sol->>Jup: /v6/quote
  Jup-->>Sol: best route
  Strat->>Sol: swap(route)
  Sol->>Jup: /v6/swap
  Jup-->>Sol: base64 txn
  Sol->>Net: sendTransaction(tx)
  Net-->>Sol: signature
Mints
Built-in demo mints: SOL, USDC. Extend mapping for more pairs.

yaml
Copy code

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
Addresses
Configure router addresses in .env. Always verify the latest deployments.

csharp
Copy code

---

### docs/06-Strategies.md
```md
# Strategies

A strategy exposes a `runOnce()` that may:
- ask the exchange for a quote,
- compute a signal,
- call `swap()` when appropriate.

## SMA Momentum (example)
- Computes `fast` and `slow` moving averages on a small simulated series around current quote.
- If `fast > slow` → buy.

## Build Your Own
```ts
export class MyStrategy {
  constructor(private ex: IExchange, private p: TradeParams) {}
  async runOnce() {
    const q = await this.ex.getQuote(this.p);
    // your logic...
    // await this.ex.swap(this.p, (q as any).route);
  }
}
Wire it in src/core/engine.ts and expose via CLI.

yaml
Copy code

---

### docs/07-LLM-Policy.md
```md
# LLM Policy

Hermes can offload the micro-decision **BUY/HOLD** to an LLM.

## Enable
```env
LLM_ENABLED=true
LLM_PROVIDER=openai   # anthropic | deepseek
OPENAI_API_KEY=...    # or ANTHROPIC_API_KEY / DEEPSEEK_API_KEY
Prompt Shape
System: "Cautious, answer BUY or HOLD only."

User: pair + current price + simple instruction.

Result is parsed; if it contains BUY, Hermes executes a swap with minOut.

yaml
Copy code

---

### docs/08-Pumpfun-Guide.md
```md
# Pump.fun Guide

Hermes treats Pump.fun tokens like normal SPL **after they migrate** to Raydium.

## Watcher
`src/watchers/pumpfun.ts` logs demo events. Replace with a real migration feed and call into your strategy when a token meets your filters (e.g., liquidity, age, holders).

## Trading
Once migrated → it's a standard SPL swap on Solana via Jupiter/Raydium. Ensure token mint mapping is pr

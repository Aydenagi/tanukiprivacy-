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

# Hermes — Open Source, All‑in‑One Trading Agent

Hermes is a modular, open‑source trading agent that supports:
- **Solana** (via Jupiter aggregator; Raydium under the hood)
- **Pump.fun tokens** (watch + trade migrated tokens via Solana/Raydium)
- **BNB Chain** (PancakeSwap / Uniswap V2 routers; or aggregators where available)
- **Astar** (EVM path; Uniswap V2 compatible routers like ArthSwap — configurable)

> **Safety first:** Hermes defaults to **PAPER** mode (no live trades).
> Flip to `MODE=LIVE` only after testing and only with burner keys you can afford to lose.

---

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Configure
cp .env.example .env
# fill RPCs and (optional) keys. Keep MODE=PAPER until you're ready.

# 3) Run in dev
npm run dev -- run --network solana --strategy momentum --base SOL --quote USDC --amount 0.1

# or watch pump.fun migrations (read‑only log)
npm run dev -- watch pumpfun --min-liquidity 5000
```

Build a production binary:
```bash
npm run build
npm start -- run --network bsc --strategy momentum --base WBNB --quote BUSD --amount 0.05
```

---

## What’s inside?

- `src/cli.ts` — CLI entry (commands: `run`, `watch`, `backtest`)
- `src/core/engine.ts` — Strategy engine and lifecycle
- `src/strategies/simpleMomentum.ts` — A tiny example strategy (SMA crossover)
- `src/exchanges/solana.ts` — Jupiter quote/swap + Solana signer
- `src/exchanges/evm.ts` — EVM (BSC/Astar) UniswapV2 router swap helpers
- `src/utils/*` — logger, math, tokens registry
- `configs/tokens/*.json` — Example token metadata

**Paper trading** is the default: balances and PnL tracked locally, trades simulated at quoted prices.
Switch to **live trading** by setting `MODE=LIVE` and providing valid keys + RPC URLs.

---

## Supported Networks

### Solana
- Quotes & routes via **Jupiter** (REST). Swaps are signed with your Solana keypair when `MODE=LIVE`.
- Pump.fun tokens are supported **after migration to Raydium** (regular SPL swaps). A lightweight watcher is included to log new migrations.

### BNB Chain (BSC)
- Generic UniswapV2 router interface (e.g., PancakeSwap).
- You can also plug in an external aggregator by modifying `evm.ts`.

### Astar
- EVM path using UniswapV2‑compatible routers (defaults provided in `.env.example`; verify current addresses).

> **Note:** DEX addresses change. Always verify router addresses before enabling `MODE=LIVE`.

---

## Environment Variables

See `.env.example` for all options. Key highlights:
- `MODE`: `PAPER` (default) or `LIVE`
- `SOLANA_RPC`, `SOLANA_KEYPAIR` (Base58 or JSON array)
- `BSC_RPC`, `ASTAR_RPC`, `EVM_PRIVATE_KEY`
- `*_UNISWAPV2_ROUTER` for manual router config
- `SLIPPAGE_BPS` slippage in basis points

---

## CLI

```
hermes run --network <solana|bsc|astar> --strategy <momentum> --base <SYM> --quote <SYM> --amount <num> [--paper]
hermes watch pumpfun --min-liquidity <usd>
hermes backtest --strategy <momentum> --pair <BASE/QUOTE> --since <7d|30d|2025-01-01>
```

Examples:
```
# SOL/USDC momentum on Solana (paper)
npm run dev -- run --network solana --strategy momentum --base SOL --quote USDC --amount 0.1

# WBNB/BUSD on BSC (paper)
npm run dev -- run --network bsc --strategy momentum --base WBNB --quote BUSD --amount 0.05
```

---

## Development & Extensibility

- Add new strategies under `src/strategies/` implementing `IStrategy`.
- Add new exchanges under `src/exchanges/` implementing `IExchange`.
- Compose them in `src/core/engine.ts`.

Pull requests and community strategies are welcome!

---

## Security & Disclaimer

- This code is for **educational purposes**. Use at your own risk.
- Smart contracts are risky; RPCs and routers can be compromised; slippage and MEV are real.
- Never use keys with significant funds. Prefer **burner wallets** on fresh machines.

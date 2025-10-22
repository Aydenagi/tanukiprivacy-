# Hermes — LIVE, Open Source, All-in-One Trading Agent

Hermes is a modular trading agent for:
- **Solana** (Jupiter/Raydium)
- **Pump.fun tokens** (after migration → standard SPL pools)
- **BNB Chain** (UniswapV2-compatible, e.g., PancakeSwap)
- **Astar** (UniswapV2-compatible)

> **LIVE ONLY:** Hermes now refuses to run in paper mode. You must provide keys and RPCs.

---

## Quick Start (LIVE)

```bash
npm i
cp .env.example .env
# Fill in RPCs/keys. MODE must be LIVE.
# Optional: set LLM_* vars to enable the LLM strategy.

# Run SMA Momentum on Solana
npm run dev -- run --network solana --strategy momentum --base SOL --quote USDC --amount 0.1

# Or use the LLM policy strategy (requires LLM keys)
npm run dev -- run --network bsc --strategy llm --base WBNB --quote BUSD --amount 0.05

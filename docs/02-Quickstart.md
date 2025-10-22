# Quickstart

1) Install & configure
```bash
npm i
cp .env.example .env
# Fill RPCs + keys (burners). MODE must be LIVE.
\
# Fill RPCs + keys (burners). MODE must be LIVE.
Solana example

bash
Copy code
npm run dev -- run --network solana --strategy momentum --base SOL --quote USDC --amount 0.1
BSC with LLM

bash
Copy code
export LLM_ENABLED=true
export OPENAI_API_KEY=sk-...   # or set in .env
npm run dev -- run --network bsc --strategy llm --base WBNB --quote BUSD --amount 0.05
Test your LLM keys

bash
Copy code
npm run dev -- llm-test
Notes
Verify router addresses in .env before trading.

Set SLIPPAGE_BPS conservatively for new pools.

yaml
Copy code

---

### docs/03-Environment.md
```md
# Environment & Config

Hermes reads `.env` via Zod parsing in `src/config.ts`.

## Required (per chain)
- **Solana**: `SOLANA_RPC`, `SOLANA_KEYPAIR`
- **EVM (BSC/Astar)**: `BSC_RPC` / `ASTAR_RPC`, `EVM_PRIVATE_KEY`, router addresses
- `MODE=LIVE`

## Optional (LLM)
LLM_ENABLED=true
LLM_PROVIDER=openai | anthropic | deepseek
OPENAI_API_KEY=... / ANTHROPIC_API_KEY=... / DEEPSEEK_API_KEY=...

markdown
Copy code

## Slippage
- `SLIPPAGE_BPS=100` → 1%
- Adjust per pair/liquidity profile.

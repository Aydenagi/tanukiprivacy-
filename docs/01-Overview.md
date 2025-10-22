# Hermes Documentation — Overview

Hermes is a **live-only**, open-source multi-chain trading agent for:
- Solana (Jupiter → Raydium)
- Pump.fun tokens (post-migration on Raydium like any SPL token)
- BNB Chain (UniswapV2/Pancake)
- Astar (UniswapV2-compatible)
- Optional LLM policy module (OpenAI / Anthropic / Deepseek).

## Core Ideas
- Small, explicit **strategy loop** (`runOnce`) you can read in one sitting.
- **Exchange adapters** isolate chain specifics from strategies.
- **LLM policy** is pluggable and optional.
- **Safety first**: you must set keys and RPCs; start with tiny sizes.

## Repo Map

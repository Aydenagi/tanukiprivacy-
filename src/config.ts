import 'dotenv/config';
import { z } from 'zod';
import type { Mode } from './types.js';

const EnvSchema = z.object({
  MODE: z.enum(['PAPER','LIVE']).default('PAPER'),
  LOG_LEVEL: z.string().default('info'),
  // Solana
  SOLANA_RPC: z.string().optional(),
  SOLANA_KEYPAIR: z.string().optional(),
  JUPITER_BASE_URL: z.string().default('https://quote-api.jup.ag'),
  // EVM
  BSC_RPC: z.string().optional(),
  ASTAR_RPC: z.string().optional(),
  EVM_PRIVATE_KEY: z.string().optional(),
  BSC_UNISWAPV2_ROUTER: z.string().optional(),
  ASTAR_UNISWAPV2_ROUTER: z.string().optional(),
  // Trading
  SLIPPAGE_BPS: z.coerce.number().default(100)
});

export const env = EnvSchema.parse(process.env);

export const mode: Mode = env.MODE as Mode;

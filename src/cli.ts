#!/usr/bin/env node
import { Command } from 'commander';
import { logger } from './utils/logger.js';
import { env, mode } from './config.js';
import { SolanaExchange } from './exchanges/solana.js';
import { EvmExchange } from './exchanges/evm.js';
import { runStrategy } from './core/engine.js';
import type { Network, TradeParams, TokenInfo } from './types.js';
import fs from 'node:fs';
import { callLLM } from './llm/router.js';

const program = new Command();
program
  .name('hermes')
  .description('Hermes — all-in-one trading agent (LIVE ONLY)')
  .version('0.2.0');

function assertLive() {
  if (mode !== 'LIVE') {
    throw new Error('Hermes is LIVE-only now. Set MODE=LIVE in your .env');
  }
}

function tokenFrom(symbol: string, network: Network): TokenInfo {
  const path = new URL(`../configs/tokens/${network}.json`, import.meta.url);
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  const info = json[symbol];
  if (!info) throw new Error(`Unknown token ${symbol} for ${network}`);
  return info;
}

function getExchange(network: Network) {
  assertLive();
  if (network === 'solana') return new SolanaExchange();
  if (network === 'bsc') return new EvmExchange('bsc');
  if (network === 'astar') return new EvmExchange('astar');
  throw new Error(`Unsupported network: ${network}`);
}

program.command('run')
  .description('Run a live strategy loop')
  .requiredOption('--network <solana|bsc|astar>', 'Network')
  .requiredOption('--strategy <momentum|llm>', 'Strategy to run')
  .requiredOption('--base <SYMBOL>', 'Base token symbol (e.g., SOL, WBNB)')
  .requiredOption('--quote <SYMBOL>', 'Quote token symbol (e.g., USDC, BUSD)')
  .requiredOption('--amount <number>', 'Trade amount in base', (v)=>Number(v))
  .option('--interval <sec>', 'Seconds between iterations', '30')
  .option('--iterations <n>', 'Number of iterations', '3')
  .action(async (opts) => {
    const net = opts.network as Network;
    const ex = getExchange(net);
    const base = tokenFrom(opts.base, net);
    const quote = tokenFrom(opts.quote, net);
    const params: TradeParams = {
      base, quote, amount: Number(opts.amount), slippageBps: env.SLIPPAGE_BPS
    };
    logger.info({ mode, net, params }, 'Starting strategy');
    await runStrategy(ex, params, { strategy: opts.strategy, intervalSec: Number(opts.interval), iterations: Number(opts.iterations) });
  });

program
  .command('llm-test')
  .description('Test your LLM keys and provider')
  .action(async()=>{
    const res = await callLLM({ system: 'You output a single word.', prompt: 'Reply with OK', max_tokens: 2 });
    logger.info({ response: res.text }, 'LLM test');
  });

program.parseAsync(process.argv).catch((e)=>{
  logger.error(e);
  process.exit(1);
});

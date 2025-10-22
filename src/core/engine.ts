import type { IExchange } from '../exchanges/index.js';
import type { TradeParams } from '../types.js';
import { SimpleMomentum } from '../strategies/simpleMomentum.js';
import { LLMPolicy } from '../strategies/llmPolicy.js';
import { logger } from '../utils/logger.js';

export type StrategyName = 'momentum' | 'llm';

export interface RunConfig {
  strategy: StrategyName;
  intervalSec: number;
  iterations: number;
}

export async function runStrategy(ex: IExchange, params: TradeParams, rc: RunConfig) {
  if (rc.strategy === 'momentum') {
    const strat = new SimpleMomentum(ex, params, { fast: 5, slow: 12, candles: 50 });
    for (let i = 0; i < rc.iterations; i++) {
      logger.info({ i: i+1, of: rc.iterations }, 'Iteration');
      await strat.runOnce();
      if (i < rc.iterations - 1) await new Promise(r => setTimeout(r, rc.intervalSec*1000));
    }
    return;
  }
  if (rc.strategy === 'llm') {
    const strat = new LLMPolicy(ex, params);
    for (let i = 0; i < rc.iterations; i++) {
      logger.info({ i: i+1, of: rc.iterations }, 'Iteration');
      await strat.runOnce();
      if (i < rc.iterations - 1) await new Promise(r => setTimeout(r, rc.intervalSec*1000));
    }
    return;
  }
  throw new Error(`Unknown strategy: ${rc.strategy}`);
}

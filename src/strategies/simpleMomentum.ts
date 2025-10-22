import type { IExchange } from '../exchanges/index.js';
import type { TradeParams } from '../types.js';
import { logger } from '../utils/logger.js';
import { sma } from '../utils/math.js';

export interface MomentumOpts {
  fast: number;
  slow: number;
  candles: number;
}

export class SimpleMomentum {
  constructor(private ex: IExchange, private params: TradeParams, private opts: MomentumOpts) {}

  async runOnce(): Promise<void> {
    // For demo: fetch recent prices via DexScreener or similar in production.
    // Here we simulate candles drifting around current quote.
    const q = await this.ex.getQuote(this.params);
    const basePrice = q.price;
    const series: number[] = [];
    for (let i = 0; i < this.opts.candles; i++) {
      const drift = (Math.random() - 0.5) * 0.02; // +/-2%
      series.push(basePrice * (1 + drift));
    }
    const fast = sma(series, this.opts.fast).at(-1)!;
    const slow = sma(series, this.opts.slow).at(-1)!;
    logger.info({ fast, slow, last: series.at(-1) }, 'SMA snapshot');

    if (fast > slow) {
      logger.info('Signal: BUY');
      const res = await this.ex.swap(this.params);
      logger.info({ res }, 'Trade result');
    } else {
      logger.info('Signal: HOLD/SELL (not implemented in demo)');
    }
  }
}

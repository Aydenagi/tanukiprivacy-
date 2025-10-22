import type { IExchange } from '../exchanges/index.js';
import type { TradeParams } from '../types.js';
import { callLLM } from '../llm/router.js';
import { logger } from '../utils/logger.js';

export class LLMPolicy {
  constructor(private ex: IExchange, private params: TradeParams) {}

  async runOnce(): Promise<void> {
    // Obtain a fresh quote as "state"
    const q = await this.ex.getQuote(this.params);
    const system = 'You are a cautious trading micro-policy. Only answer with BUY or HOLD.';
    const prompt = `Pair: ${this.params.base.symbol}/${this.params.quote.symbol}
Price (quote per base): ${q.price.toFixed(8)}
Instruction: Reply with BUY if a small buy is reasonable now; otherwise reply with HOLD.`;

    const resp = await callLLM({ system, prompt, max_tokens: 4 });
    const decision = (resp.text || '').toUpperCase();
    logger.info({ decision, price: q.price }, 'LLM decision');

    if (decision.includes('BUY')) {
      const res = await this.ex.swap(this.params, (q as any).route);
      logger.info({ res }, 'Executed BUY');
    } else {
      logger.info('HOLD — no trade executed');
    }
  }
}

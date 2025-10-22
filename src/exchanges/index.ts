import type { Quote, TradeParams, TradeResult } from '../types.js';

export interface IExchange {
  readonly network: 'solana' | 'bsc' | 'astar';
  getQuote(params: TradeParams): Promise<Quote>;
  swap(params: TradeParams, route?: any): Promise<TradeResult>;
  getBalance?(symbolOrAddress: string): Promise<string>;
}

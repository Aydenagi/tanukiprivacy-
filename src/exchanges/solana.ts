import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { env } from '../config.js';
import type { IExchange } from './index.js';
import type { Quote, TradeParams, TradeResult } from '../types.js';

const JUP_BASE = env.JUPITER_BASE_URL;

function toAtomic(amount: number, decimals: number): string {
  return Math.floor(amount * 10 ** decimals).toString();
}

export class SolanaExchange implements IExchange {
  readonly network = 'solana' as const;
  private connection: Connection;
  private keypair: Keypair;

  constructor() {
    this.connection = new Connection(env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com', 'confirmed');
    if (!env.SOLANA_KEYPAIR) throw new Error('SOLANA_KEYPAIR is required for LIVE trading');
    try {
      if (env.SOLANA_KEYPAIR.startsWith('[')) {
        const arr = JSON.parse(env.SOLANA_KEYPAIR);
        this.keypair = Keypair.fromSecretKey(Uint8Array.from(arr));
      } else {
        const secret = bs58.decode(env.SOLANA_KEYPAIR);
        this.keypair = Keypair.fromSecretKey(secret);
      }
    } catch (e) {
      throw new Error('Failed to parse SOLANA_KEYPAIR');
    }
  }

  async getQuote(p: TradeParams): Promise<Quote> {
    const inputMint = this.mintForSymbol(p.base.symbol);
    const outputMint = this.mintForSymbol(p.quote.symbol);
    const amount = toAtomic(p.amount, p.base.decimals);
    const url = `${JUP_BASE}/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${p.slippageBps}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Jupiter quote failed: ${res.status}`);
    const data: any = await res.json();
    const best = data?.data?.[0];
    if (!best) throw new Error('No route from Jupiter');
    const price = Number(best.outAmount) / Number(amount);
    return { inAmount: amount, outAmount: best.outAmount, price, route: best };
  }

  async swap(p: TradeParams, route?: any): Promise<TradeResult> {
    if (!route) {
      const q = await this.getQuote(p);
      route = (q as any).route;
    }
    const swapReq = {
      quoteResponse: route,
      userPublicKey: this.keypair.publicKey.toBase58(),
      wrapAndUnwrapSol: true
    };
    const res = await fetch(`${JUP_BASE}/v6/swap`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swapReq)
    });
    if (!res.ok) throw new Error(`Jupiter swap failed: ${res.status}`);
    const { swapTransaction } = await res.json();
    const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
    tx.sign([this.keypair]);
    const sig = await this.connection.sendTransaction(tx, { skipPreflight: true });
    return { simulated: false, filledPrice: Number(route.outAmount)/Number(route.inAmount), txId: sig };
  }

  private mintForSymbol(sym: string): string {
    const map: Record<string, string> = {
      SOL: 'So11111111111111111111111111111111111111112',
      USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    };
    if (!map[sym]) throw new Error(`Unknown Solana mint for symbol ${sym}`);
    return map[sym];
  }
}

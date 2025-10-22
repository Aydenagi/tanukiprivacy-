import { ethers } from 'ethers';
import type { IExchange } from './index.js';
import type { Quote, TradeParams, TradeResult } from '../types.js';
import { env } from '../config.js';

const UNISWAPV2_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() view returns (uint8)'
];

function toAtomic(amount: number, decimals: number): bigint {
  return ethers.parseUnits(amount.toString(), decimals);
}

export class EvmExchange implements IExchange {
  readonly network: 'bsc' | 'astar';
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private router: ethers.Contract;

  constructor(network: 'bsc'|'astar') {
    this.network = network;
    const rpc = network === 'bsc' ? env.BSC_RPC : env.ASTAR_RPC;
    if (!rpc) throw new Error(`Missing RPC for ${network}`);
    if (!env.EVM_PRIVATE_KEY) throw new Error('EVM_PRIVATE_KEY required for LIVE trading');
    this.provider = new ethers.JsonRpcProvider(rpc);
    this.wallet = new ethers.Wallet(env.EVM_PRIVATE_KEY, this.provider);
    const routerAddr = network === 'bsc' ? (env.BSC_UNISWAPV2_ROUTER || '') : (env.ASTAR_UNISWAPV2_ROUTER || '');
    if (!routerAddr) throw new Error(`Missing router address for ${network}`);
    this.router = new ethers.Contract(routerAddr, UNISWAPV2_ABI, this.wallet);
  }

  async getQuote(p: TradeParams): Promise<Quote> {
    if (!p.base.address || !p.quote.address) throw new Error('EVM tokens require addresses');
    const path = [p.base.address, p.quote.address];
    const inAtomic = toAtomic(p.amount, p.base.decimals);
    const amounts = await this.router.getAmountsOut(inAtomic, path);
    const outAtomic = amounts[amounts.length - 1];
    const price = Number(outAtomic) / Number(inAtomic);
    return { inAmount: inAtomic.toString(), outAmount: outAtomic.toString(), price };
  }

  private async ensureAllowance(tokenAddr: string, owner: string, spender: string, needed: bigint) {
    const erc20 = new ethers.Contract(tokenAddr, ERC20_ABI, this.wallet);
    const allowance: bigint = await erc20.allowance(owner, spender);
    if (allowance < needed) {
      const tx = await erc20.approve(spender, needed);
      await tx.wait();
    }
  }

  async swap(p: TradeParams): Promise<TradeResult> {
    const quote = await this.getQuote(p);
    const minOut = BigInt(quote.outAmount) * BigInt(10000 - env.SLIPPAGE_BPS) / 10000n;
    const to = await this.wallet.getAddress();
    const deadline = Math.floor(Date.now()/1000) + 60 * 10;
    const path = [p.base.address!, p.quote.address!];

    // Approve router to spend base tokens
    await this.ensureAllowance(p.base.address!, to, await this.router.getAddress(), BigInt(quote.inAmount));

    const tx = await this.router.swapExactTokensForTokens(
      quote.inAmount, minOut, path, to, deadline
    );
    const receipt = await tx.wait();
    return { simulated: false, filledPrice: Number(quote.outAmount)/Number(quote.inAmount), txId: receipt?.hash };
  }
}

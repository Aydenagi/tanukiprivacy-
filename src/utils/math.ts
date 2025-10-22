export const bpsToPct = (bps: number) => bps / 10000;

export function sma(values: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(Number.isFinite(avg) ? avg : NaN);
  }
  return result;
}

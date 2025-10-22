# Troubleshooting

**Swap failing on Solana**
- Check `SOLANA_RPC` latency.
- Ensure `SOLANA_KEYPAIR` parses (base58 vs JSON array).

**Allowance errors on EVM**
- Your base token may require `approve()` first; Hermes auto-approves but verify wallet has gas.

**Price/Decimals mismatch**
- Confirm token decimals in `configs/tokens/*.json`.

**LLM errors**
- Set `LLM_ENABLED=true` and the correct `*_API_KEY`.

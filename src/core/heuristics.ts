import { TanukiEvent } from "../router";
import { AstarConfig } from "./config";

let score = 0;
let lastUpdate = Date.now();

export function evaluate(
  event: TanukiEvent,
  config: AstarConfig
): number {
  const now = Date.now();
  const elapsed = (now - lastUpdate) / 1000;

  // decay
  score *= Math.exp(-elapsed / config.decay_seconds);
  lastUpdate = now;

  switch (event.type) {
    case "PROCESS_EVENT":
      score += config.weights.suspicious_child_process || 0;
      break;
    case "FILE_EVENT":
      if (event.sensitive) {
        score += config.weights.wallet_file_access || 0;
      }
      break;
    case "NETWORK_EVENT":
      score += config.weights.network_exfiltration || 0;
      break;
  }

  return Math.round(score);
}

import { registerHandler } from "../router";
import { loadConfig } from "./config";
import { evaluate } from "./heuristics";
import { respond } from "./responder";
import { log } from "../utils/logger";

export function startAgent() {
  const config = loadConfig();

  registerHandler((event) => {
    const score = evaluate(event, config);
    respond(score, config.thresholds);
  });

  log("info", "Tanuki agent started");
}

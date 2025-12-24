import { log } from "../utils/logger";

export function respond(score: number, thresholds: any) {
  if (score >= thresholds.terminate) {
    log("error", `Critical threat score ${score}`);
    if (process.env.TANUKI_ALLOW_PROCESS_KILL === "true") {
      log("warn", "Process termination enabled (not implemented)");
    }
  } else if (score >= thresholds.isolate) {
    log("warn", `High threat score ${score}`);
  } else if (score >= thresholds.alert) {
    log("info", `Alert-level threat score ${score}`);
  }
}

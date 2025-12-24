
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const CURRENT =
  (process.env.TANUKI_LOG_LEVEL as LogLevel) || "info";

export function log(level: LogLevel, message: string) {
  if (LEVELS[level] >= LEVELS[CURRENT]) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

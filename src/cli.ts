#!/usr/bin/env node

import { startAgent } from "./core/agent";
import { loadConfig } from "./core/config";

const command = process.argv[2];

async function main() {
  const config = loadConfig();

  switch (command) {
    case "start":
      await startAgent(config);
      break;
    case "status":
      console.log("Tanuki running (local mode)");
      break;
    default:
      console.log("Usage: tanuki <start|status>");
  }
}

main();

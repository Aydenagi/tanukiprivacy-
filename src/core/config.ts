import fs from "fs";
import path from "path";

export function loadConfig() {
  const astarPath = path.resolve("configs/astar.json");
  const astar = JSON.parse(fs.readFileSync(astarPath, "utf-8"));

  return {
    astar,
    llm: {
      provider: process.env.TANUKI_LLM_PROVIDER || "none",
      openaiKey: process.env.TANUKI_OPENAI_KEY,
      anthropicKey: process.env.TANUKI_ANTHROPIC_KEY,
      localModel: process.env.TANUKI_LOCAL_MODEL
    }
  };
}

#!/usr/bin/env node
import { access, mkdir, copyFile, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "agent", "super-fullstack-agent.agent.md");

function help() {
  console.log([
    "DEV-AI Super Fullstack Agent",
    "",
    "Install into the current project:",
    "  npx @chetan11fb/dev-ai-super-fullstack-agent",
    "",
    "Install with npm:",
    "  npm install --save-dev @chetan11fb/dev-ai-super-fullstack-agent",
    "  npx dev-ai-super-fullstack-agent",
    "",
    "Then use in VS Code GitHub Copilot:",
    "  @super-fullstack-agent <your task>",
    "",
    "Options:",
    "  install    Install the custom agent (default)",
    "  --force    Overwrite an existing agent file",
    "  --help     Show this help"
  ].join("\n"));
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) return help();

  const command = args.find(x => !x.startsWith("--")) ?? "install";
  if (command !== "install") throw new Error("Unknown command: " + command);

  const force = args.includes("--force");
  const target = resolve(process.cwd(), ".github", "agents", "super-fullstack-agent.agent.md");

  if (await exists(target) && !force) {
    throw new Error("Agent already exists: " + target + ". Use --force to overwrite.");
  }

  await mkdir(dirname(target), { recursive: true });
  await copyFile(SOURCE, target);

  const content = await readFile(target, "utf8");
  if (!content.includes("name: super-fullstack-agent")) {
    throw new Error("Installed agent validation failed.");
  }

  console.log("✓ DEV-AI Super Fullstack Agent installed.");
  console.log("  " + target);
  console.log("");
  console.log("Open this project in VS Code and use:");
  console.log("  @super-fullstack-agent <your task>");
}

main().catch(error => {
  console.error("✗ " + error.message);
  process.exitCode = 1;
});

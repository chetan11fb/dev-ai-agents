#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const registry = JSON.parse(await readFile(new URL("../registry/marketplace.json", import.meta.url), "utf8"));
const errors = [];
const seen = new Set();
for (const item of registry.components ?? []) {
  const key = `${item.type}:${item.id}`;
  if (seen.has(key)) errors.push(`Duplicate registry ID: ${key}`);
  seen.add(key);
  const source = resolve(item.path);
  if (!existsSync(source)) errors.push(`Missing source path for ${key}: ${item.path}`);
  if (item.type === "agent") {
    const expected = `npx dev-ai-agents --agent ${item.id}`;
    if (item.installCommand !== expected) errors.push(`Incorrect installCommand for ${key}; expected: ${expected}`);
    if (item.target !== `.github/agents/${item.path.split("/").pop()}`) errors.push(`Unexpected agent install target for ${key}: ${item.target}`);
  }
}
const agentFiles = [];
async function walk(dir) {
  for (const entry of await (await import("node:fs/promises")).readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && entry.name.endsWith(".agent.md")) agentFiles.push(path.replace(process.cwd()+"/","").replaceAll("\\\\","/"));
  }
}
await walk(resolve("agents"));
const registeredAgentPaths = new Set(registry.components.filter(x => x.type === "agent").map(x => x.path));
for (const path of agentFiles) if (!registeredAgentPaths.has(path)) errors.push(`Agent file missing from registry: ${path}`);
for (const path of registeredAgentPaths) if (!agentFiles.includes(path)) errors.push(`Registry agent has no source file: ${path}`);
if (errors.length) {
  console.error("DEV-AI registry validation failed:\\n- " + errors.join("\\n- "));
  process.exit(1);
}
console.log(`DEV-AI registry validation passed: ${agentFiles.length} agent files registered; ${registry.components.length} total components checked.`);

#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const REPO = "chetan11fb/dev-ai-agents";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const REGISTRY_URL = `${RAW_BASE}/registry/marketplace.json`;

const c = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m"
};
const log = (m, color = "") => console.log(`${color}${m}${color ? c.reset : ""}`);

function usage() {
  console.log(`
DEV-AI Agents CLI

Individual installation:
  npx dev-ai-agents --agent dev-ai-fullstack-engineer
  npx dev-ai-agents --skill dotnet-development
  npx dev-ai-agents --prompt ado-story-to-fullstack
  npx dev-ai-agents --mcp azure-devops
  npx dev-ai-agents --plugin ai-team-orchestration
  npx dev-ai-agents --setting vscode-fullstack

Other:
  npx dev-ai-agents --list
  npx dev-ai-agents --all

Options:
  --agent <id>       Install an agent
  --skill <id>       Install a skill
  --prompt <id>      Install a reusable prompt
  --plugin <id>      Install a plugin
  --mcp <id>         Install an MCP configuration
  --setting <id>     Install a DEV-AI setting
  --all              Install every component in the registry
  --list             List available components
  --target <path>    Override the installation root
  --force            Overwrite existing files
  --help             Show help

Examples:
  npx dev-ai-agents --agent dev-ai-dotnet
  npx dev-ai-agents --agent dev-ai-qa
  npx dev-ai-agents --skill accessibility
  npx dev-ai-agents --prompt backend-dotnet-webapi
  npx dev-ai-agents --mcp github
  npx dev-ai-agents --mcp azure-devops
`);
}

async function fetchJson(url) {
  const r = await fetch(url, { headers: { "User-Agent": "dev-ai-agents-cli" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.json();
}

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": "dev-ai-agents-cli" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.text();
}

function parseArgs(argv) {
  const o = { components: [], target: ".", force: false, list: false, all: false };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === "--help" || a === "-h") o.help = true;
    else if (a === "--list") o.list = true;
    else if (a === "--all") o.all = true;
    else if (a === "--force") o.force = true;
    else if (["--agent", "--skill", "--prompt", "--plugin", "--mcp", "--setting"].includes(a)) {
      const type = a.slice(2);
      const id = argv[++i];
      if (!id) throw new Error(`Missing value for ${a}`);
      o.components.push({ type, id });
    } else if (a === "--target") {
      o.target = argv[++i] ?? ".";
    } else {
      throw new Error(`Unknown option: ${a}`);
    }
  }

  return o;
}

function find(registry, type, id) {
  return registry.components.find(x => x.type === type && x.id === id);
}

async function writeRemoteFile(destination, url, force) {
  try {
    await readFile(destination);
    if (!force) {
      throw new Error(`File exists: ${destination}. Use --force to overwrite.`);
    }
  } catch (e) {
    if (e.message.startsWith("File exists:")) throw e;
  }

  const content = await fetchText(url);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
  log(`  ✓ ${destination}`, c.green);
}

async function install(component, root, force) {
  if (component.type === "plugin") {
    const tree = await fetchJson(
      `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`
    );
    const prefix = component.path.replace(/\/$/, "") + "/";
    const entries = tree.tree.filter(
      x => x.type === "blob" && x.path.startsWith(prefix)
    );

    if (!entries.length) {
      throw new Error(`No files found for plugin ${component.id}`);
    }

    for (const e of entries) {
      await writeRemoteFile(
        resolve(root, component.target, e.path.slice(prefix.length)),
        `${RAW_BASE}/${e.path}`,
        force
      );
    }

    return entries.length;
  }

  await writeRemoteFile(
    resolve(root, component.target),
    `${RAW_BASE}/${component.path}`,
    force
  );

  return 1;
}

function list(registry) {
  const types = ["agent", "skill", "prompt", "plugin", "mcp", "setting"];

  for (const type of types) {
    const items = registry.components.filter(x => x.type === type);
    log(`\\n${type.toUpperCase()}S (${items.length})`, c.cyan);

    for (const x of items) {
      console.log(`  ${x.id}  ${c.dim}→ ${x.target}${c.reset}`);
    }
  }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));

  if (o.help) return usage();

  log("\\n◆ DEV-AI Agents", c.cyan);

  const registry = await fetchJson(REGISTRY_URL);

  if (o.list) return list(registry);

  const selected = o.all
    ? registry.components
    : o.components.map(x => {
        const item = find(registry, x.type, x.id);
        if (!item) {
          throw new Error(`Component not found: ${x.type}/${x.id}`);
        }
        return item;
      });

  if (!selected.length) return usage();

  log(`Installing ${selected.length} component(s)...\\n`, c.yellow);

  let count = 0;

  for (const item of selected) {
    log(`→ ${item.type}: ${item.id}`, c.cyan);
    count += await install(item, o.target, o.force);
  }

  log(`\\n✓ Installed ${count} file(s) successfully.`, c.green);
}

main().catch(e => {
  log(`\\n✗ ${e.message}`, c.red);
  process.exitCode = 1;
});

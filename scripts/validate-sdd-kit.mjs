#!/usr/bin/env node
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const errors = [];
async function read(path) {
  try { return await readFile(resolve(root, path), "utf8"); }
  catch (error) { errors.push(`Missing/unreadable ${path}: ${error.message}`); return ""; }
}
async function mustNotExist(path) {
  try { await access(resolve(root, path), constants.F_OK); errors.push(`Obsolete competing template must be removed: ${path}`); }
  catch {}
}

const agent = await read("agents/dev-ai-sdd.agent.md");
const constitution = await read("installer/sdd-kit/.specify/memory/constitution.md");
const spec = await read("installer/sdd-kit/specs/_template/spec.md");
const plan = await read("installer/sdd-kit/specs/_template/plan.md");
const tasks = await read("installer/sdd-kit/specs/_template/tasks.md");
const schemaText = await read("installer/sdd-kit/.specify/schemas/sdd-state.schema.json");
const stateValidator = await read("installer/sdd-kit/scripts/validate-sdd-state.mjs");
const registryText = await read("registry/marketplace.json");
const packageText = await read("package.json");

if (agent.length > 30000) errors.push(`SDD agent exceeds 30,000 characters (${agent.length})`);
if (!agent.startsWith("---\n") || !agent.slice(4).includes("\n---\n")) errors.push("SDD agent YAML frontmatter is missing or malformed");
for (const marker of ["CONSTITUTION_REVIEW_REQUIRED", "sdd-state.json", "revision", "CONVERGED", "Idempotence and correction control", "NOT RUN"]) {
  if (!agent.includes(marker)) errors.push(`SDD agent missing required control: ${marker}`);
}
if (!/DRAFT\s*[—-]\s*review before use\./i.test(constitution)) errors.push("Constitution template must clearly be an unapproved draft");
for (const [name, content] of [["spec", spec], ["plan", plan], ["tasks", tasks]]) {
  if (!content.startsWith("# ")) errors.push(`Template ${name} must start with a Markdown heading`);
  if (!/^SDD Revision: R1$/m.test(content)) errors.push(`Template ${name} must use canonical 'SDD Revision: R1' metadata`);
  if (!/^Status: DRAFT$/m.test(content)) errors.push(`Template ${name} must start in DRAFT status`);
}
await mustNotExist("installer/sdd-kit/specs/_template/sdd-state.md");
await mustNotExist("installer/sdd-kit/specs/_template/decisions.md");

let schema, registry, pkg;
try { schema = JSON.parse(schemaText); } catch (e) { errors.push(`Invalid state schema JSON: ${e.message}`); }
try { registry = JSON.parse(registryText); } catch (e) { errors.push(`Invalid registry JSON: ${e.message}`); }
try { pkg = JSON.parse(packageText); } catch (e) { errors.push(`Invalid package.json: ${e.message}`); }

const expectedStates = ["CONSTITUTION_REVIEW_REQUIRED", "SPEC_REVIEW_REQUIRED", "PLAN_REVIEW_REQUIRED", "TASK_REVIEW_REQUIRED", "IMPLEMENTATION_READY", "CONVERGING", "CONVERGED", "FINAL_REVIEW_REQUIRED", "DONE", "BLOCKED"];
const lifecycleMatch = agent.match(/Valid lifecycle states:\s*\n\n~~~text\n([\s\S]*?)\n~~~/);
if (!lifecycleMatch) errors.push("Agent must define a canonical lifecycle state list");
else {
  const agentStates = lifecycleMatch[1].split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  if (schemaText && schema && agentStates.join("|") !== schema.properties?.status?.enum?.join("|")) errors.push("Agent lifecycle states and JSON schema enum are inconsistent");
}
if (schema) {
  if (schema.properties?.status?.enum?.join("|") !== ["INITIALIZING","CONSTITUTION_REVIEW_REQUIRED","READY_FOR_SPEC","SPECIFYING","SPEC_REVIEW_REQUIRED","SPEC_APPROVED","PLANNING","PLAN_REVIEW_REQUIRED","PLAN_APPROVED","TASKING","TASK_REVIEW_REQUIRED","TASKS_APPROVED","ANALYZING","IMPLEMENTATION_READY","IMPLEMENTING","VALIDATING","CONVERGING","CONVERGED","FINAL_REVIEW_REQUIRED","DONE","BLOCKED"].join("|")) errors.push("State schema lifecycle enum is missing or out of canonical order");
  for (const state of expectedStates) if (!schema.properties?.status?.enum?.includes(state)) errors.push(`State schema missing lifecycle state ${state}`);
  for (const key of ["spec","plan","tasks"]) if (!schema.properties?.artifacts?.properties?.[key]) errors.push(`State schema missing artifacts.${key}`);
}
if (registry) {
  const agentItem = registry.components?.find(x => x.id === "dev-ai-sdd" && x.type === "agent");
  const kitItem = registry.components?.find(x => x.id === "dev-ai-sdd-templates" && x.type === "sdd-kit");
  if (!agentItem || agentItem.version !== "1.3.0") errors.push("Registry must register Dev-AI SDD agent version 1.3.0");
  if (!kitItem || kitItem.version !== "1.2.0") errors.push("Registry must register SDD templates version 1.2.0");
}
if (pkg && (!pkg.scripts?.["validate:sdd"] || !pkg.scripts?.test)) errors.push("package.json must expose validate:sdd and test scripts");

if (errors.length) {
  console.error("DEV-AI SDD kit validation FAILED:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`DEV-AI SDD kit validation passed: agent ${agent.length} chars; canonical revision metadata, constitution gate, lifecycle schema and installer templates are aligned.`);

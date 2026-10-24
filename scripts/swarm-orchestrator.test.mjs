import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agent = await readFile("agents/dev-ai-swarm-orchestrator.agent.md", "utf8");
const registry = JSON.parse(await readFile("registry/marketplace.json", "utf8"));
const matrix = await readFile("docs/sdd-runtime-qa-matrix.md", "utf8");

test("swarm orchestrator remains registered and within a practical prompt budget", () => {
  assert.ok(agent.length < 30000, `Swarm prompt is ${agent.length} characters`);
  assert.ok(registry.components.some(x => x.type === "agent" && x.id === "dev-ai-swarm-orchestrator" && x.path === "agents/dev-ai-swarm-orchestrator.agent.md"));
});

test("multi-story implementation remains dependency- and acceptance-criteria-aware", () => {
  assert.match(agent, /Establish a complete story set/);
  assert.match(agent, /Story → Acceptance Criterion → SDD Requirement → Task → Project\/Path → Verification/);
  assert.match(agent, /one active worker owns a mutable file/);
  assert.match(agent, /per-story/i);
  assert.match(agent, /Do not claim autonomous spawning/);
});

test("optional Orca integration requires runtime and version-matched guide evidence", () => {
  assert.match(agent, /Orca is an optional adapter, not a dependency/);
  assert.match(agent, /orca status --json/);
  assert.match(agent, /orca skills get orchestration/);
  assert.match(agent, /Do not install Orca, enable experimental settings/);
  assert.match(agent, /do not reconstruct CLI arguments from memory/);
});

test("worker completion, retry, and integration require evidence", () => {
  assert.match(agent, /timeout, empty wait, lost connection, idle terminal, or missing message is a checkpoint/);
  assert.match(agent, /Retry only after confirming the previous attempt is no longer authoritative/);
  assert.match(agent, /Narrative alone is not evidence/);
  assert.match(agent, /UNVERIFIABLE/);
  assert.match(agent, /per-worker success is not feature success/);
});

test("section numbering is unique and Orca adoption is documented", async () => {
  const headings = [...agent.matchAll(/^# (\d+)\./gm)].map(m => Number(m[1]));
  assert.equal(new Set(headings).size, headings.length, "Duplicate numbered section heading");
  assert.deepEqual(headings, Array.from({ length: headings.length }, (_, i) => i + 1));
  const decision = await readFile("docs/orca-pattern-adoption.md", "utf8");
  assert.match(decision, /No mandatory Orca install/);
  assert.match(decision, /RT-35–RT-39 remain NOT RUN/);
});

test("manual handoffs do not masquerade as autonomous parallel execution", () => {
  assert.match(agent, /If the host only supports manual handoffs/);
  assert.match(agent, /Do not simulate a scheduler or claim true parallelism/);
});

test("runtime QA matrix covers supervised multi-agent failure modes", () => {
  assert.match(matrix, /RT-30 \| Host supports only manual agent handoffs/);
  assert.match(matrix, /RT-31 \| One story passes while another story fails/);
  assert.match(matrix, /RT-33 \| A downstream task's API\/event contract changes/);
});

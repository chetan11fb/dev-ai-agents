import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agent = await readFile("agents/dev-ai-sdd.agent.md", "utf8");
const matrix = await readFile("docs/sdd-runtime-qa-matrix.md", "utf8");
const swarm = await readFile("agents/dev-ai-swarm-orchestrator.agent.md", "utf8");

test("Copilot SDD prompt stays within the supported character budget", () => {
  assert.ok(agent.length <= 30000, `Prompt is ${agent.length} characters; limit is 30000`);
});

test("multi-story ADO command is discoverable", () => {
  assert.match(agent, /run stories <ADO-ID,\.\.\.>/);
  assert.match(agent, /run stories 123,124,125/);
});

test("multi-story SDD run preserves traceability and executes the full approved lifecycle", () => {
  assert.match(agent, /fetch each story and acceptance criteria independently/);
  assert.match(agent, /one feature folder, spec\/plan\/tasks set, and `sdd-state\.json`/);
  assert.match(agent, /stable AC IDs/);
  assert.match(agent, /Default to sequential slices/);
  assert.match(agent, /Validate every story's criteria/);
  assert.match(agent, /Never update ADO states\/comments\/links unless asked/);
  assert.match(agent, /not analysis-only/);
  assert.match(agent, /continue\/resume through implementation and convergence/);
  assert.match(agent, /UNKNOWN blocks implementation until assessed/);
});

test("swarm orchestrator implements a combined multi-story run safely", () => {
  assert.match(swarm, /one end-to-end feature run, not merely a combined analysis/);
  assert.match(swarm, /one compact story matrix/);
  assert.match(swarm, /Default to sequential work/);
  assert.match(swarm, /actual runtime isolation/);
  assert.match(swarm, /execute tool is not assumed to be sandboxed/i);
  assert.match(swarm, /update ADO states\/comments, open PRs, merge, or deploy unless explicitly authorized/);
});

test("multi-story runtime acceptance scenario is documented", () => {
  assert.match(matrix, /RT-23 \| Run 3 related ADO stories/);
  assert.match(matrix, /NOT RUN — requires real VS Code\/Copilot \+ connected ADO MCP runtime/);
  assert.match(matrix, /RT-01 through RT-18, RT-22, and RT-23 for multi-story capability/);
});

test("numbered prompt headings are unique and sequential", () => {
  const numbers = [...agent.matchAll(/^## (\d+)\./gm)].map((m) => Number(m[1]));
  assert.equal(new Set(numbers).size, numbers.length, "Duplicate numbered section heading");
  assert.deepEqual(numbers, Array.from({ length: numbers.length }, (_, i) => i + 1));
});

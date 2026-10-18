import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agent = await readFile("agents/dev-ai-sdd.agent.md", "utf8");
const matrix = await readFile("docs/sdd-runtime-qa-matrix.md", "utf8");
const swarm = await readFile("agents/dev-ai-swarm-orchestrator.agent.md", "utf8");

test("Copilot SDD prompt stays within the supported character budget", () => {
  assert.ok(agent.length <= 30000, `Prompt is ${agent.length} characters; limit is 30000`);
});

test("multi-story feature command is discoverable", () => {
  assert.match(agent, /feature <feature-name> <ADO story IDs\/URLs>/);
  assert.match(agent, /orchestrate multiple related ADO stories as one feature/);
  assert.match(agent, /Unless analysis-only is requested, `feature` means continue after approvals through implementation and convergence/);
  assert.match(agent, /do not stop after analysis/);
});

test("multi-story workflow stays feature-scoped, traceable, and honest", () => {
  assert.match(agent, /one feature folder/);
  assert.match(agent, /not one set per story/);
  assert.match(agent, /retrieved\/missing IDs/);
  assert.match(agent, /per-story/i);
  assert.match(agent, /parallel/i);
  assert.match(agent, /resume/i);
});

test("execution safety and validation evidence rules remain present", () => {
  assert.match(agent, /Execution safety/);
  assert.match(agent, /NOT RUN/);
  assert.match(agent, /Never reset, clean, discard, or overwrite unrelated work/);
});

test("multi-story orchestrator owns the full implementation lifecycle safely", () => {
  assert.match(swarm, /one end-to-end feature run, not analysis-only/);
  assert.match(swarm, /one story matrix/);
  assert.match(swarm, /Default to sequential work/);
  assert.match(swarm, /actual runtime isolation/);
  assert.match(swarm, /execute.*not assumed to be sandboxed/i);
  assert.match(swarm, /Never mark the feature complete while any required story\/AC is blocked or unverified/);
  assert.match(swarm, /Do not recreate completed work, update ADO states\/comments, open PRs, merge, or deploy unless explicitly authorized/);
});

test("multi-story runtime cases and release gate are documented", () => {
  assert.match(matrix, /RT-23 \| Submit 2–4 related ADO stories/);
  assert.match(matrix, /RT-24 \| One requested ADO story cannot be retrieved/);
  assert.match(matrix, /RT-25 \| Multi-story set contains dependencies/);
  assert.match(matrix, /RT-26 \| One story fails or becomes blocked/);
  assert.match(matrix, /RT-22 through RT-27/);
});

test("numbered prompt headings are unique and sequential", () => {
  const numbers = [...agent.matchAll(/^## (\d+)\./gm)].map((m) => Number(m[1]));
  assert.equal(new Set(numbers).size, numbers.length, "Duplicate numbered section heading");
  assert.deepEqual(numbers, Array.from({ length: numbers.length }, (_, i) => i + 1));
});

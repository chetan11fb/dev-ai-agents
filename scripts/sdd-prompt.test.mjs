import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agent = await readFile("agents/dev-ai-sdd.agent.md", "utf8");
const matrix = await readFile("docs/sdd-runtime-qa-matrix.md", "utf8");
const workingAgent = await readFile("agents/sdd.working.agent.md", "utf8");
const registry = JSON.parse(await readFile("registry/marketplace.json", "utf8"));

test("Copilot SDD prompt stays within the supported character budget", () => {
  assert.ok(agent.length <= 30000, `Prompt is ${agent.length} characters; limit is 30000`);
});

test("multi-story feature command is discoverable", () => {
  assert.match(agent, /feature <feature-name> <ADO story IDs\/URLs>/);
  assert.match(agent, /orchestrate multiple related ADO stories as one feature/);
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

test("multi-story runtime cases and release gate are documented", () => {
  assert.match(matrix, /RT-23 \| Submit 2–4 related ADO stories/);
  assert.match(matrix, /RT-24 \| One requested ADO story cannot be retrieved/);
  assert.match(matrix, /RT-25 \| Multi-story set contains dependencies/);
  assert.match(matrix, /RT-26 \| One story fails or becomes blocked/);
  assert.match(matrix, /RT-22 through RT-26/);
});

test("numbered prompt headings are unique and sequential", () => {
  const numbers = [...agent.matchAll(/^## (\d+)\./gm)].map((m) => Number(m[1]));
  assert.equal(new Set(numbers).size, numbers.length, "Duplicate numbered section heading");
  assert.deepEqual(numbers, Array.from({ length: numbers.length }, (_, i) => i + 1));
});


test("SDD Working agent keeps questions and approvals user-friendly", () => {
  assert.match(workingAgent, /Clear questions and approvals/);
  assert.match(workingAgent, /Required/);
  assert.match(workingAgent, /Optional/);
  assert.match(workingAgent, /three independent questions/);
  assert.match(workingAgent, /APPROVE SPEC/);
  assert.match(workingAgent, /REQUEST CHANGES/);
  assert.match(workingAgent, /real form, textbox, or Submit button/);
});

test("SDD Working agent is registered for individual npm installation", () => {
  const item = registry.components.find(x => x.type === "agent" && x.id === "sdd-working");
  assert.ok(item, "sdd-working must exist in marketplace registry");
  assert.equal(item.path, "agents/sdd.working.agent.md");
  assert.equal(item.target, ".github/agents/sdd.working.agent.md");
  assert.equal(item.installCommand, "npx dev-ai-agents --agent sdd-working");
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agent = await readFile("agents/dev-ai-sdd.agent.md", "utf8");
const matrix = await readFile("docs/sdd-runtime-qa-matrix.md", "utf8");

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
  assert.match(agent, /missing story/i);
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

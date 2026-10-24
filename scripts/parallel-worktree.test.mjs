import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const skill = await readFile("skills/development/parallel-worktree-orchestration/SKILL.md", "utf8");
const prompt = await readFile("prompts/parallel-worktree-engineering.md", "utf8");
const swarm = await readFile("agents/dev-ai-swarm-orchestrator.agent.md", "utf8");
const registry = JSON.parse(await readFile("registry/marketplace.json", "utf8"));

test("parallel worktree skill requires runtime capability detection and honest fallback", () => {
  assert.match(skill, /ISOLATED_PARALLEL/);
  assert.match(skill, /SHARED_WORKSPACE/);
  assert.match(skill, /Never infer runtime capabilities/);
  assert.match(skill, /Serialize all code edits/i);
});

test("parallel worktree workflow protects user changes and shared contracts", () => {
  assert.match(skill, /Never reset, clean, stash over, or overwrite unrelated changes/);
  assert.match(skill, /Shared contract barrier/);
  assert.match(skill, /mark dependent tasks STALE/);
  assert.match(skill, /user's approval/);
});

test("competing implementations require common base, evidence and deliberate selection", () => {
  assert.match(skill, /same base SHA/);
  assert.match(skill, /acceptance matrix/);
  assert.match(skill, /Do not combine incompatible branches blindly/);
  assert.match(prompt, /Competing candidates/);
  assert.match(prompt, /actual diff/);
});

test("Swarm Orchestrator references the installable capability-aware workflow", () => {
  assert.match(swarm, /Orca-inspired worktree-aware execution/);
  assert.match(swarm, /Never claim background execution without runtime evidence/);
  assert.match(swarm, /parallel-worktree-engineering\.md/);
});

test("new prompt and skill are discoverable from the marketplace registry", () => {
  const promptEntry = registry.components.find(x => x.type === "prompt" && x.id === "parallel-worktree-engineering");
  const skillEntry = registry.components.find(x => x.type === "skill" && x.id === "parallel-worktree-orchestration");
  assert.equal(promptEntry?.path, "prompts/parallel-worktree-engineering.md");
  assert.equal(promptEntry?.target, "docs/prompts/parallel-worktree-engineering.md");
  assert.equal(skillEntry?.path, "skills/development/parallel-worktree-orchestration/SKILL.md");
  assert.equal(skillEntry?.target, ".github/skills/parallel-worktree-orchestration/SKILL.md");
});

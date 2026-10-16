#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const temp = await mkdtemp(join(tmpdir(), "dev-ai-sdd-state-test-"));
const validator = resolve("installer/sdd-kit/scripts/validate-sdd-state.mjs");
const run = (dir) => spawnSync(process.execPath, [validator, dir], { encoding: "utf8" });
try {
  const featureDir = join(temp, "specs", "001-demo");
  await mkdir(featureDir, { recursive: true });
  for (const name of ["spec", "plan", "tasks"]) {
    await writeFile(join(featureDir, name + ".md"), `# ${name}\n\nSDD Revision: R1\nStatus: DRAFT\n`);
  }
  const state = {
    schemaVersion: 1,
    feature: "demo",
    featurePath: featureDir,
    status: "TASK_REVIEW_REQUIRED",
    risk: "LOW",
    artifacts: {
      spec: { path: "spec.md", revision: "R1", status: "CURRENT" },
      plan: { path: "plan.md", revision: "R1", status: "CURRENT" },
      tasks: { path: "tasks.md", revision: "R1", status: "CURRENT" }
    },
    approvals: {
      constitution: { revision: "R1", status: "APPROVED", approvedAt: null },
      spec: { revision: "R1", status: "APPROVED", approvedAt: null, decision: "APPROVE SPEC" },
      plan: { revision: "R1", status: "APPROVED", approvedAt: null, decision: "APPROVE PLAN" },
      tasks: { revision: null, status: "PENDING", approvedAt: null },
      final: { revision: null, status: "PENDING", approvedAt: null }
    },
    stale: [],
    blockingIssue: null,
    nextAction: "Review tasks"
  };
  const statePath = join(featureDir, "sdd-state.json");
  await writeFile(statePath, JSON.stringify(state, null, 2));
  let result = run(featureDir);
  assert.equal(result.status, 0, "valid state should pass: " + result.stderr + result.stdout);

  state.approvals.spec.revision = "R0";
  await writeFile(statePath, JSON.stringify(state, null, 2));
  result = run(featureDir);
  assert.notEqual(result.status, 0, "stale approval revision must fail");
  assert.match(result.stderr + result.stdout, /does not match current artifact revision/);

  state.approvals.spec.revision = "R1";
  state.artifacts.tasks.path = "../escape.md";
  await writeFile(statePath, JSON.stringify(state, null, 2));
  result = run(featureDir);
  assert.notEqual(result.status, 0, "path traversal must fail");
  assert.match(result.stderr + result.stdout, /escapes the feature directory/);

  console.log("SDD state validator tests passed: valid state, revision-bound approval, and path traversal guard.");
} finally {
  await rm(temp, { recursive: true, force: true });
}

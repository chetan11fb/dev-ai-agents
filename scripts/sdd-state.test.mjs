import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const validator = resolve("installer/sdd-kit/.dev-ai/sdd/validate-state.mjs");

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "dev-ai-sdd-"));
  const featureDir = join(root, "specs", "001-example");
  await mkdir(featureDir, { recursive: true });
  await writeFile(join(featureDir, "spec.md"), "# Spec\n\nSDD Revision: R1\n");
  const state = {
    schemaVersion: 1,
    feature: "example",
    featurePath: "specs/001-example",
    status: "SPEC_APPROVED",
    risk: "LOW",
    artifacts: {
      spec: { path: "spec.md", revision: "R1", status: "CURRENT" },
      plan: { path: "plan.md", revision: null, status: "MISSING" },
      tasks: { path: "tasks.md", revision: null, status: "MISSING" }
    },
    approvals: {
      constitution: { revision: null, status: "NOT_REQUIRED", approvedAt: null, dependsOn: {} },
      spec: { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T10:00:00.000Z", dependsOn: {} },
      plan: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null } },
      tasks: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null, plan: null } },
      final: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null, plan: null, tasks: null } }
    },
    stale: [],
    blockingIssue: null,
    nextAction: "Create plan"
  };
  const statePath = join(featureDir, "sdd-state.json");
  await writeFile(statePath, JSON.stringify(state, null, 2));
  return { root, featureDir, state, statePath };
}

function run(featureDir) {
  return spawnSync(process.execPath, [validator, featureDir], { encoding: "utf8" });
}

test("accepts a valid current spec approval", async () => {
  const f = await fixture();
  try {
    const result = run(f.featureDir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASSED/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects a state/file revision mismatch", async () => {
  const f = await fixture();
  try {
    f.state.artifacts.spec.revision = "R2";
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /does not match file revision/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects approval when the artifact revision is stale", async () => {
  const f = await fixture();
  try {
    await writeFile(join(f.featureDir, "spec.md"), "# Spec\n\nSDD Revision: R2\n");
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /does not match file revision|approval revision does not match/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects a downstream phase without its required approvals", async () => {
  const f = await fixture();
  try {
    f.state.status = "IMPLEMENTATION_READY";
    await writeFile(join(f.featureDir, "plan.md"), "# Plan\n\nSDD Revision: R1\n");
    await writeFile(join(f.featureDir, "tasks.md"), "# Tasks\n\nSDD Revision: R1\n");
    f.state.artifacts.plan = { path: "plan.md", revision: "R1", status: "CURRENT" };
    f.state.artifacts.tasks = { path: "tasks.md", revision: "R1", status: "CURRENT" };
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /requires an approved current plan|requires approved current tasks/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("invalidates downstream approvals when an upstream revision changes", async () => {
  const f = await fixture();
  try {
    await writeFile(join(f.featureDir, "spec.md"), "# Spec\n\nSDD Revision: R2\n");
    await writeFile(join(f.featureDir, "plan.md"), "# Plan\n\nSDD Revision: R1\n");
    await writeFile(join(f.featureDir, "tasks.md"), "# Tasks\n\nSDD Revision: R1\n");
    f.state.status = "TASKS_APPROVED";
    f.state.artifacts.spec = { path: "spec.md", revision: "R2", status: "CURRENT" };
    f.state.artifacts.plan = { path: "plan.md", revision: "R1", status: "CURRENT" };
    f.state.artifacts.tasks = { path: "tasks.md", revision: "R1", status: "CURRENT" };
    f.state.approvals.spec = { revision: "R2", status: "APPROVED", approvedAt: "2026-10-16T11:00:00.000Z", dependsOn: {} };
    f.state.approvals.plan = { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T11:10:00.000Z", dependsOn: { spec: "R1" } };
    f.state.approvals.tasks = { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T11:20:00.000Z", dependsOn: { spec: "R1", plan: "R1" } };
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /approval is stale: dependsOn\.spec must equal current spec revision/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects artifact paths that escape the feature folder", async () => {
  const f = await fixture();
  try {
    f.state.artifacts.spec.path = "../../outside.md";
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /escapes feature folder/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

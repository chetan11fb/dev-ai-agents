import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
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
      constitution: { revision: null, status: "NOT_REQUIRED", approvedAt: null, dependsOn: {}, reason: "Existing non-draft constitution inspected and reused" },
      spec: { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T10:00:00.000Z", dependsOn: {} },
      plan: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null } },
      tasks: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null, plan: null } },
      risk: { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: null, plan: null, tasks: null } },
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


async function prepareImplementationReady(f) {
  await writeFile(join(f.featureDir, "plan.md"), "# Plan\n\nSDD Revision: R1\n");
  await writeFile(join(f.featureDir, "tasks.md"), "# Tasks\n\nSDD Revision: R1\n");
  f.state.status = "IMPLEMENTATION_READY";
  f.state.artifacts.plan = { path: "plan.md", revision: "R1", status: "CURRENT" };
  f.state.artifacts.tasks = { path: "tasks.md", revision: "R1", status: "CURRENT" };
  f.state.approvals.spec = { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T10:00:00.000Z", dependsOn: {} };
  f.state.approvals.plan = { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T10:10:00.000Z", dependsOn: { spec: "R1" } };
  f.state.approvals.tasks = { revision: "R1", status: "APPROVED", approvedAt: "2026-10-16T10:20:00.000Z", dependsOn: { spec: "R1", plan: "R1" } };
  f.state.approvals.final = { revision: null, status: "PENDING", approvedAt: null, dependsOn: { spec: "R1", plan: "R1", tasks: "R1" } };
  await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
}

const allCurrentGates = () => ({
  analysis: { status: "PASSED", specRevision: "R1", planRevision: "R1", tasksRevision: "R1", completedAt: "2026-10-16T10:30:00.000Z", evidence: ["Cross-artifact analysis: no unresolved conflicts"] },
  validation: { status: "PASSED", specRevision: "R1", planRevision: "R1", tasksRevision: "R1", completedAt: "2026-10-16T11:30:00.000Z", evidence: ["npm test: passed", "Acceptance criteria AC-001 verified"] },
  convergence: { status: "PASSED", specRevision: "R1", planRevision: "R1", tasksRevision: "R1", completedAt: "2026-10-16T11:45:00.000Z", evidence: ["No material gaps remain against approved acceptance criteria"] }
});

test("blocks implementation readiness when persisted analysis evidence is missing", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Gate analysis must have status PASSED/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("accepts implementation readiness only when analysis is tied to current revisions", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.gates = allCurrentGates();
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASSED/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("blocks convergence when validation evidence is missing", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.status = "CONVERGED";
    f.state.gates = allCurrentGates();
    delete f.state.gates.validation;
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Gate validation must have status PASSED or ACCEPTED_LIMITATION/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects gate evidence tied to stale artifact revisions", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.gates = allCurrentGates();
    f.state.gates.analysis.specRevision = "R0";
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Gate analysis revisions do not match/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects artifact symlinks that escape the feature folder", async () => {
  const f = await fixture();
  try {
    const outside = join(f.root, "outside.md");
    await writeFile(outside, "# Outside\n\nSDD Revision: R1\n");
    await symlink(outside, join(f.featureDir, "linked-spec.md"));
    f.state.artifacts.spec.path = "linked-spec.md";
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Artifact symlink escapes feature folder/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});


test("blocks feature work while constitution approval is pending", async () => {
  const f = await fixture();
  try {
    f.state.status = "SPEC_REVIEW_REQUIRED";
    f.state.approvals.constitution = { revision: null, status: "PENDING", approvedAt: null, dependsOn: {}, reason: null };
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /requires a ratified\/reused constitution/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("requires an auditable reason when a pre-existing constitution is marked NOT_REQUIRED", async () => {
  const f = await fixture();
  try {
    f.state.approvals.constitution.reason = " ";
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /NOT_REQUIRED requires a reason/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("blocks high-risk implementation readiness without a separate risk approval", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.risk = "CRITICAL";
    f.state.gates = allCurrentGates();
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /requires an approved risk approval/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("accepts high-risk implementation readiness only with revision-bound risk approval", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.risk = "HIGH";
    f.state.approvals.risk = { revision: null, status: "APPROVED", approvedAt: "2026-10-16T10:25:00.000Z", dependsOn: { spec: "R1", plan: "R1", tasks: "R1" } };
    f.state.gates = allCurrentGates();
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 0, result.stderr);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("rejects a risk approval when any approved artifact revision changes", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.risk = "CRITICAL";
    f.state.approvals.risk = { revision: null, status: "APPROVED", approvedAt: "2026-10-16T10:25:00.000Z", dependsOn: { spec: "R0", plan: "R1", tasks: "R1" } };
    f.state.gates = allCurrentGates();
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /risk approval is stale: dependsOn\.spec/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test("blocks implementation readiness while risk remains unknown", async () => {
  const f = await fixture();
  try {
    await prepareImplementationReady(f);
    f.state.risk = "UNKNOWN";
    f.state.gates = allCurrentGates();
    await writeFile(f.statePath, JSON.stringify(f.state, null, 2));
    const result = run(f.featureDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /risk to be assessed; UNKNOWN risk blocks implementation readiness/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});
